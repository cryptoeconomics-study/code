var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')
var {Node, getTxHash} = require('../nodeAgent')
var _ = require('lodash')

// Spender is a Node that sends a random transaction at every tick()
class Authority extends Node {
  constructor (wallet, genesis, network, authority) {
    super(wallet, genesis, network)
    this.orderNonce = 0
  }
  onReceive(tx) {
    if (this.transactions.includes(tx)) {
      return
    }
    this.transactions.push(tx)
    this.applyTransaction(tx)
    this.applyInvalidNonceTxs(tx.contents.from)
  }

  orderAndBroadcast(tx) {
    tx.contents.orderNonce = this.orderNonce
    this.orderNonce++
    const authSig = EthCrypto.sign(this.wallet.privateKey, getTxHash(tx))
    tx.sigs.push(authSig)
    this.network.broadcast(this.pid, tx)
  }

  applyTransaction (tx) {
    // Check the from address matches the signature
    const signer = EthCrypto.recover(tx.sigs[0], getTxHash(tx.contents))
    if (signer !== tx.contents.from) {
      throw new Error('Invalid signature!')
    }
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in this.state)) {
      this.state[[tx.contents.to]] = {
        balance: 0,
        nonce: 0
      }
    }
    // Check that the nonce is correct for replay protection
    if (tx.contents.nonce !== this.state[[tx.contents.from]].nonce) {
      // If it isn't correct, then we should add the transaction to invalidNonceTxs
      if (!(tx.contents.from in this.invalidNonceTxs)) {
        this.invalidNonceTxs[tx.contents.from] = {}
      }
      this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx
      return
    }
    if (tx.contents.type === 'send') { // Send coins
      if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!')
      }
      this.state[[tx.contents.from]].balance -= tx.contents.amount
      this.state[[tx.contents.to]].balance += tx.contents.amount
      //after aplpying, add orderNonce, sign, and broadcast
      this.orderAndBroadcast(tx)
    } else {
      throw new Error('Invalid transaction type!')
    }
    this.state[[tx.contents.from]].nonce += 1
  }
}

module.exports = Authority
