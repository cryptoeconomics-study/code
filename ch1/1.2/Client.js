const EthCrypto = require('eth-crypto')

// The client that end-users will use to interact with our central payment processor
class Client {
		// Initializes a public/private key pair for the user
    constructor() {
        this.wallet = EthCrypto.createIdentity()
    }

		// Creates a keccak256/SHA3 hash of some data 
    toHash(data) {
        return EthCrypto.hash.keccak256(data)
    }

		// Signs a hash of data with the client's private key
    sign(message) {
        const messageHash = this.toHash(message)
        return EthCrypto.sign(
            this.wallet.privateKey,
            messageHash
        )
    }

		// Verifies that a messageHash is signed by a certain address
    verify(signature, messageHash, address) {
        const signer = EthCrypto.recover(signature, messageHash)
        return signer === address
    }

    // Generates new transactions
    function generateTx(to, amount, type) {
        // TODO:
        // - create an unsigned transaction
        // - create a signature of the transaction
        // - return a Javascript object with the unsigned transaction and transaction signature
    }
}

module.exports = Client;

