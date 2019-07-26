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
        // a pool of pending transactoins
        this.pendingTransactions = []
    }

    // Generates new transactions
    function generateTx(to, amount, type) {
        // TODO:
        // - create an unsigned transaction
        // - create a digital signature of the transaction
        // - return a Javascript object with the unsigned transaction and transaction signature
    }

    // Processes transactions and updates the state
    function stateTransitionFunction(transaction) {
        // TODO: apply transaction to this.state
        // Note: in the future this is where we'll apply protocol rules to check the transaction and reject those that are invalid, but right now we're just going to process all transactions as valid
    }
}

module.exports = Paypal;
