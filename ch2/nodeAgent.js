const EthCrypto = require('eth-crypto');

// Create a hash of a transaction (where tx is a Javascript object)
function getTxHash(tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx));
}

// The Node class is very similar to the centralized payments operator in chapter 1 ("PayPal"),
// but here every node on the network will process and verify transactions vs just sending and receiving data from a server
class Node {
  // Initialize the node's state
  constructor(wallet, genesis, network) {
    // create a public/private key pair and initialize an address for this node
    this.wallet = wallet;
    // P2P node identity -- used for connecting to peers
    this.p2pNodeId = EthCrypto.createIdentity();
    // peer identity
    this.pid = this.p2pNodeId.address;
    // the network we're on
    this.network = network;
    // our view of the state of the network
    this.state = genesis;
    // our list of processed valid transactions
    this.transactions = [];
    // our list of pending transactions that have invalid nonces
    this.invalidNonceTxs = {};
  }

  // What the node does when it receives transactions
  onReceive(tx) {
    // if we already have the transaction
    if (this.transactions.includes(tx)) {
      // return to exit the function
      return;
    }
    // add the transaction to the node's transactions array
    this.transactions.push(tx);
    // process the transaction
    this.applyTransaction(tx);
    // broadcast the transaction to the rest of the network so they can process it too
    this.network.broadcast(this.pid, tx);
    // check for other transactions that might be in the invalid nonce pool from the same sender
    // because once the first transaction was processed, maybe some new ones will be valid now
    this.applyInvalidNonceTxs(tx.contents.from);
  }

  // Protocol for dealing with received transactions that have an invalid nonce
  applyInvalidNonceTxs(address) {
    // figure out what the current nonce is for that address
    const targetNonce = this.state[address].nonce;
    // if the invalid nonce pool has a transaction from the address that matches the current nonce
    if (
      address in this.invalidNonceTxs
      && targetNonce in this.invalidNonceTxs[address]
    ) {
      // process the transaction
      this.applyTransaction(this.invalidNonceTxs[address][targetNonce]);
      // delete the transaction from the invalid nonce pool
      delete this.invalidNonceTxs[address][targetNonce];
      // check for other transactions that might be in the invalid nonce pool from the same sender
      // because once the first transaction was processed, maybe some new ones will be valid now
      this.applyInvalidNonceTxs(address);
    }
  }

  tick() {}

  // Generates a Javascript object with an unsigned transaction and a signature of that unsigned transaction
  generateTx(to, amount) {
    // create an unsigned transaction object
    const unsignedTx = {
      // type of transaction
      type: 'send',
      // amount of transaction
      amount,
      // which address the transaction is from
      from: this.wallet.address,
      // which address the transaction is going to
      to,
      // the nonce of the sender's address at the time of creating this transaction
      nonce: this.state[this.wallet.address].nonce,
    };
    // create a transaction object
    const tx = {
      // unsigned transaction
      contents: unsignedTx,
      // signature of the unsigned transaction
      // (hash the unsigned transaction object and then sign it with this node's private key)
      sig: EthCrypto.sign(this.wallet.privateKey, getTxHash(unsignedTx)),
    };
    // return the transaction object
    return tx;
  }

  // This is a simplified version of the protocol that Paypal used in chapter 1
  // This time, every node in the network performs their own verification of transaction on the network vs just being a client that receives data from a server
  applyTransaction(tx) {
    // Check that the from address matches the signature in the transaction
    const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents));
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
    if (tx.contents.nonce !== this.state[[tx.contents.from]].nonce) {
      // If it isn't correct, then we should add the transaction to invalidNonceTxs
      if (!(tx.contents.from in this.invalidNonceTxs)) {
        this.invalidNonceTxs[tx.contents.from] = {};
      }
      this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx;
      return;
    }
    if (tx.contents.type === 'send') {
      // Send coins
      if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!');
      }
      this.state[[tx.contents.from]].balance -= tx.contents.amount;
      this.state[[tx.contents.to]].balance += tx.contents.amount;
    } else {
      throw new Error('Invalid transaction type!');
    }
    // increment the nonce of the sender of the transaction in our state
    this.state[[tx.contents.from]].nonce += 1;
  }
}

module.exports = { Node, getTxHash };
