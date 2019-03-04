var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')
var {Node, getTxHash} = require('../nodeAgent')
var _ = require('lodash')

// Spender is a Node that sends a random transaction at every tick()
class FaultTolerant extends Node {
  constructor (wallet, genesis, network, delta) {
    super(wallet, genesis, network)
    this.delta = delta
    this.pendingTxs = {}
    this.seen = []
  }

  timeout(timestamp, numObservers) {
    return timestamp + (numObservers - 0.5) * 2 * this.delta
  }
  addressesFromSigs(tx) {
      let addressSet = new Set()
      for (let i = 0; i < tx.sigs.length; i++) {
        const sig = tx.sigs[i]
        const slicedTx = {
          contents: tx.contents,
          sigs: tx.sigs.slice(0,i)
        }
        const messageHash = getTxHash(slicedTx)
        const address = EthCrypto.recover(sig, messageHash)
        if(i===0 && address !== tx.contents.from) throw new Error('Invalid first signature!')
        addressSet.add(address)
      }
      return addressSet
  }

  onReceive (tx) {
    if (this.seen.includes(tx.contents)) return
    const sigs = this.addressesFromSigs(tx)
    //TODO catch error if first signee is not tx sender
    if(this.network.time >= this.timeout(tx.contents.timestamp, sigs.size)) return
    //seen tx
    this.seen.push(tx.contents)
    //TODO Check that each signee is actually a peer in the network
      //-possible attack: byzantine node signs a message 100 times with random Private Key
    const finalTimeout = this.timeout(tx.contents.timestamp, this.network.agents.length)
    if (!this.pendingTxs[finalTimeout]) this.pendingTxs[finalTimeout] = []
    //add to pending ( we'll apply this transaction once we hit finalTimeout)
    this.pendingTxs[finalTimeout].push(tx)
    //Choice rule: if have two transactions with same sender, nonce, and timestamp apply the one with lower sig first
    this.pendingTxs[finalTimeout].sort((a, b)=>{
      return a.sigs[0] - b.sigs[0]
    })

    //add signature
    tx.sigs.push(EthCrypto.sign(this.wallet.privateKey, getTxHash(tx)))
    this.network.broadcast(this.pid, tx)
  }

  tick () {
    const {time} = this.network
    const toApply = this.pendingTxs[time]
    if(!toApply) return
    for (let tx of toApply) {
      this.applyTransaction(tx)
    }
    delete this.pendingTxs[time]
  }

  generateTx (to, amount) {
    const unsignedTx = {
      type: 'send',
      amount: amount,
      from: this.wallet.address,
      to: to,
      nonce: this.state[this.wallet.address].nonce,
      timestamp: this.network.time
    }
    const tx = {
      contents: unsignedTx,
      sigs: []
    }
    tx.sigs.push(EthCrypto.sign(this.wallet.privateKey, getTxHash(tx)))
    return tx
  }

  applyTransaction (tx) {
    console.log('~~~~~~~~~APPLY TRANSACTION~~~~~~~~~~', tx)
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in this.state)) {
      this.state[[tx.contents.to]] = {
        balance: 0,
        nonce: 0
      }
    }
    // Check that the nonce is correct for replay protection
    if (tx.contents.nonce > this.state[tx.contents.from].nonce) {
        if (!(tx.contents.from in this.invalidNonceTxs)) {
            this.invalidNonceTxs[tx.contents.from] = {}
        }
        this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx
        return
    } else if (tx.contents.nonce < this.state[tx.contents.from].nonce) {
        console.log('passed nonce tx rejected')
        return
    }
    //Apply send to balances
    if (tx.contents.type === 'send') { // Send coins
      if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!')
      }
      this.state[[tx.contents.from]].balance -= tx.contents.amount
      this.state[[tx.contents.to]].balance += tx.contents.amount
    } else {
      throw new Error('Invalid transaction type!')
    }
    this.state[[tx.contents.from]].nonce += 1
  }
}

module.exports = FaultTolerant
