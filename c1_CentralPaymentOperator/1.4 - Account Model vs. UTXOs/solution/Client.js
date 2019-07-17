const EthCrypto = require('eth-crypto')

class Client {
    constructor() {
        this.wallet = EthCrypto.createIdentity()
    }

    toHash(data) {
        const dataStr = JSON.stringify(data)
        return EthCrypto.hash.keccak256(dataStr)
    }

    sign(message) {
        const messageHash = this.toHash(message)
        return EthCrypto.sign(
            this.wallet.privateKey,
            messageHash
        )
    }

    verify(signature, messageHash, address) {
        const signer = EthCrypto.recover(signature, messageHash)
        return signer === address
    }
}


module.exports = Client;

