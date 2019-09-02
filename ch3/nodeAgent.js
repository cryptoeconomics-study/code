var EthCrypto = require('eth-crypto')

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

class Node {
  constructor (wallet, genesis, network) {
    // Blockchain identity
    this.wallet = wallet
    // P2P Node identity -- used for connecting to peers
    this.p2pNodeId = EthCrypto.createIdentity()
    this.pid = this.p2pNodeId.address
    this.network = network
    this.state = genesis
    this.transactions = []
    this.nonce = 0
  }

  onReceive (tx) {
    if (this.transactions.includes(tx)) {
      return
    }
    this.transactions.push(tx)
    this.applyTransaction(tx, this.state)
    this.network.broadcast(this.pid, tx)
  }

  tick () {}

  generateTx (to, amount) {
    const unsignedTx = {
      type: 'send',
      amount: amount,
      from: this.wallet.address,
      to: to,
      nonce: this.nonce
    }
    const tx = {
      contents: unsignedTx,
      sig: EthCrypto.sign(this.wallet.privateKey, getTxHash(unsignedTx))
    }
    this.nonce++ //added so a node can send multiple txs before applying them (before they are included in a block)
    return tx
  }
  isValidTxSig(tx) {
    const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents))
    if (signer !== tx.contents.from) {
      console.log('Invalid Signature on tx:', tx)
      return false //Invalid Signature
    } else return true
  }

  applyTransaction (tx, state) {
    // Check the from address matches the signature
    if(!this.isValidTxSig(tx)) return false
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in state)) {
      state[[tx.contents.to]] = {
        balance: 0,
        nonce: 0
      }
    }
    // Check that the nonce is correct for replay protection
    if (tx.contents.nonce !== state[[tx.contents.from]].nonce) {
      console.log('Invalid nonce on tx:', tx)
      return false
    }
    if (tx.contents.type === 'send') { // Send coins
      if (state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        console.log('Not enough money to spend tx:', tx)
        return false
      }
      state[[tx.contents.from]].balance -= tx.contents.amount
      state[[tx.contents.to]].balance += tx.contents.amount
    } else if (tx.contents.type === 'mint') { //Block reward
      //TODO handle block reward
      // Check the from address matches the signature
      // const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents))
      // if (signer !== tx.contents.to) {
      //   throw new Error('Invalid signature in mint tx!')
      // }
      // // Update state
      // this.state[[tx.contents.to]].balance += tx.contents.amount
    } else {
      console.log('Invalid transaction type!')
      return false
    }
    state[[tx.contents.from]].nonce += 1
    return true
  }
}

module.exports = {Node, getTxHash}
