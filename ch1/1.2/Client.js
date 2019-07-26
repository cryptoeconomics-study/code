const EthCrypto = require('eth-crypto')

class Client {
    constructor() {
      //TODO
    }

    toHash(data) {
      //TODO
    }

    sign(message) {
      // TODO
    }

    verify(signature, messageHash, address) {
      //TODO
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

