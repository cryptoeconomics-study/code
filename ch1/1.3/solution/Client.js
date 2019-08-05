const EthCrypto = require("eth-crypto");

// The client that end-users will use to interact with our central payment processor
class Client {
  // Initializes a public/private key pair for the user
  constructor() {
    this.wallet = EthCrypto.createIdentity();
    // initialize the nonce
    this.nonce = 0;
  }

  // Creates a keccak256/SHA3 hash of some data
  hash(data) {
    return EthCrypto.hash.keccak256(data);
  }

  // Signs a hash of data with the client's private key
  sign(message) {
    const messageHash = this.hash(message);
    return EthCrypto.sign(this.wallet.privateKey, messageHash);
  }

  // Verifies that a messageHash is signed by a certain address
  verify(signature, messageHash, address) {
    const signer = EthCrypto.recover(signature, messageHash);
    return signer === address;
  }

  // Buys tokens from Paypal
  buy(amount) {
    // Let the user know that they just exchanged off-network goods for network tokens
    console.log(`You bought ${amount} magic tokens from Paypal`);
  }

  // Generates new transactions
  generateTx(to, amount, type) {
    // create an unsigned transaction
    const unsignedTx = {
      type: type,
      amount: amount,
      from: this.wallet.address,
      to: to,
      // add wallet nonce to tx
      nonce: this.nonce
    };
    // create a signature of the transaction
    const tx = {
      contents: unsignedTx,
      sig: this.sign(unsignedTx)
    };
    // increment the wallet's nonce parameter AFTER the tx object is created
    this.nonce++;
    // return a Javascript object with the unsigned transaction and transaction signature
    return tx;
  }
}

module.exports = Client;
