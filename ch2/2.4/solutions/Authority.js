const EthCrypto = require('eth-crypto');
const _ = require('lodash');
const NetworkSimulator = require('../networkSim');
const { Node, getTxHash } = require('../../nodeAgent');

// Authority extends Node and provides functionality needed to receive, order, and broadcast transactions
class Authority extends Node {
  constructor(wallet, genesis, network) {
    super(wallet, genesis, network);
    this.orderNonce = 0;
  }

  onReceive(tx) {
    if (this.transactions.includes(tx)) {
      return;
    }
    this.transactions.push(tx);
    this.applyTransaction(tx);
    this.applyInvalidNonceTxs(tx.contents.from);
  }

  // Order transactions and broadcast that ordering to the network
  orderAndBroadcast(tx) {
    // give the transactiona the latest nonce in the Authority node's state
    tx.contents.orderNonce = this.orderNonce;
    // increment the nonce
    this.orderNonce++;
    // sign the transaction to give it "proof of authority"
    const authSig = EthCrypto.sign(this.wallet.privateKey, getTxHash(tx));
    // add the signed transaction to the history
    tx.sigs.push(authSig);
    // broadcast the transaction to the network
    this.network.broadcast(this.pid, tx);
  }

  applyTransaction(tx) {
    // Check the from address matches the signature
    const slicedTx = {
      contents: tx.contents,
      sigs: [],
    };
    const signer = EthCrypto.recover(tx.sigs[0], getTxHash(slicedTx));
    if (signer !== tx.contents.from) {
      throw new Error('Invalid signature!');
    }
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in this.state)) {
      this.state[[tx.contents.to]] = {
        balance: 0,
        nonce: 0,
      };
    }
    // Check that the nonce is correct for replay protection
    if (tx.contents.nonce > this.state[tx.contents.from].nonce) {
      if (!(tx.contents.from in this.invalidNonceTxs)) {
        this.invalidNonceTxs[tx.contents.from] = {};
      }
      this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx;
      return;
    }
    if (tx.contents.nonce < this.state[tx.contents.from].nonce) {
      console.log('passed nonce tx rejected');
      return;
    }
    if (tx.contents.type === 'send') {
      // Send coins
      if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!');
      }
      this.state[[tx.contents.from]].balance -= tx.contents.amount;
      this.state[[tx.contents.to]].balance += tx.contents.amount;
      // after applying, add orderNonce, sign, and broadcast
      this.orderAndBroadcast(tx);
    } else {
      throw new Error('Invalid transaction type!');
    }
    this.state[[tx.contents.from]].nonce += 1;
  }
}

module.exports = Authority;
