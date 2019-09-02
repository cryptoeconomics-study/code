const EthCrypto = require('eth-crypto');
const _ = require('lodash');
const NetworkSimulator = require('../../networkSim');
const { Node, getTxHash } = require('../../nodeAgent');

class PoA extends Node {
  constructor(wallet, genesis, network, authority) {
    super(wallet, genesis, network);
    this.authority = authority; // Eth Address of the authority node
    this.orderNonce = 0;
  }

  onReceive(tx) {
    if (this.transactions.includes(tx)) {
      return;
    }
    this.transactions.push(tx);
    this.applyTransaction(tx);
    this.network.broadcast(this.pid, tx);
    this.applyInvalidNonceTxs();
  }

  generateTx(to, amount) {
    const unsignedTx = {
      type: 'send',
      amount,
      from: this.wallet.address,
      to,
      nonce: this.state[this.wallet.address].nonce,
    };
    const tx = {
      contents: unsignedTx,
      sigs: [],
    };
    tx.sigs.push(EthCrypto.sign(this.wallet.privateKey, getTxHash(tx)));
    return tx;
  }

  applyInvalidNonceTxs() {
    if (this.orderNonce in this.invalidNonceTxs) {
      this.applyTransaction(this.invalidNonceTxs[this.orderNonce]);
      delete this.invalidNonceTxs[this.orderNonce - 1]; // -1 because we increment orderNonce in applyTransaction
      this.applyInvalidNonceTxs();
    }
  }

  applyTransaction(tx) {
    // get tx from before the authority node added ordering
    const originalTx = _.cloneDeep(tx);
    delete originalTx.contents.orderNonce;
    originalTx.sigs = [];
    // get tx from before the auth node signed it
    const slicedTx = {
      contents: tx.contents,
      sigs: tx.sigs.slice(0, 1),
    };
    // check the signer of the transaction and throw an error if the signature cannot be verified
    const signer = EthCrypto.recover(tx.sigs[0], getTxHash(originalTx));
    if (signer !== tx.contents.from) {
      throw new Error('Invalid signature!');
    }
    // check the autority for the network and throw an error if the transaction does not
    const authority = EthCrypto.recover(tx.sigs[1], getTxHash(slicedTx));
    if (authority !== this.authority) {
      throw new Error('Invalid signature!');
    }
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in this.state)) {
      this.state[tx.contents.to] = {
        balance: 0,
        nonce: 0,
      };
    }
    // Check that this is the next transaction in the Authority node's ordering
    if (tx.contents.orderNonce > this.orderNonce) {
      this.invalidNonceTxs[tx.contents.orderNonce] = tx;
      return;
    }
    if (tx.contents.nonce < this.orderNonce) {
      console.log('passed nonce. tx rejected');
      return;
    }
    // if all checks pass...
    if (tx.contents.type === 'send') {
      // Send coins
      if (this.state[tx.contents.from].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!');
      }
      this.state[tx.contents.from].balance -= tx.contents.amount;
      this.state[tx.contents.to].balance += tx.contents.amount;
    } else {
      throw new Error('Invalid transaction type!');
    }
    // increment nonce
    this.state[tx.contents.from].nonce++;
    this.orderNonce++;
  }
}

module.exports = PoA;
