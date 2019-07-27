const EthCrypto = require('eth-crypto')

// The client that end-users will use to interact with our central payment processor
class Client {
	// Initializes a public/private key pair for the user
    constructor() {
        this.wallet = EthCrypto.createIdentity()
    }

	// Creates a keccak256/SHA3 hash of some data 
    toHash(data) {
				// ?! why is this JSON.stringify thing here, but not in 1.1 ???
        const dataStr = JSON.stringify(data)
        return EthCrypto.hash.keccak256(dataStr)
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
    generateTx(to, amount, type) {
        const unsignedTx = {
            type: type,
            amount: amount,
            from: this.wallet.address,
            to: to,
        }
        const tx = {
            contents: unsignedTx,
            sig: this.sign(unsignedTx)
        }
        return tx
    }
}

module.exports = Client;

