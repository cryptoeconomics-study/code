const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')
const Paypal = require('./Paypal.js')

class FTPaypal extends Paypal {
    constructor() {
        super()
        //Add backups for fault tolerance
        this.backups = []
    }
    onReceive(tx) {
        super.onReceive(tx)
        for (let backup in this.backups) {
            //Send transactions to all backups
            backup.onReceive(tx)
        }
    }
}

module.exports = Paypal;
