const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')

class Paypal extends Client {
    constructor(genesis) {
        super()
        this.state = {
            [this.wallet.address]: {
                balance: 0
            }
        }
        this.transactions = []
    }
}

module.exports = Paypal;
