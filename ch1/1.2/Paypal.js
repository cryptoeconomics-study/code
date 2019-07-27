const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')

// Our naive implimentation of a centralized payment processor
class Paypal extends Client {
    constructor(genesis) {
        super()
        // the state of the network (accounts and balances)
        this.state = {
            [this.wallet.address]: {
                balance: 0
            }
        }
        // the history of transactions
        this.transactions = []
    }

	// Checks and processes transactions
	applyTransaction(tx) {
		// TODO:
        // - check the transaction signature
		// - check the address is in the state, and if not, add it
		// - mint tokens only if sender is PayPal
		// - check that tx sender balances are >= tx amount
	}
}

module.exports = Paypal;
