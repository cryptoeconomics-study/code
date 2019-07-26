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

    // Receives a transaction, checks if it's valid, and updates the state
    function stateTransitionFunction(transaction) {
        // TODO: 
			  // - if a transaction is minting new tokens, check that the sender is the central payment operator (PayPal)
        // - if a transaction is moving tokens from one wallet to another, check that the sender's account balance is greater than or equal to the amount of the transaction
        // - if all checks pass, process the transaction (updated the account balances accordingly and add the transaction to this.transactions) 
    }
}

module.exports = Paypal;
