const EthCrypto = require('eth-crypto')

// The client that end-users will use to interact with our central payment processor
class Client {
	// The constructor will initialize a public/private key pair for the user
	// - the public key is like an username or address that people can send stuff to
	// - the private key is like a password or key that allows someone to access the stuff in the account and send transactions/messages from that account
    constructor() {
      //TODO
    }

	// Creates a keccak256/SHA3 hash of some data 
    toHash(data) {
      //TODO
    }

	// Signs a hash of data with the client's private key
    sign(data) {
      // TODO
    }

	// Verifies that a messageHash is signed by a certain address
    verify(signature, messageHash, address) {
      //TODO
    }
}

module.exports = Client;
