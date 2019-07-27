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
        this.transactionHistory = []
    }

	// Checks that the sender of a transaction is the same as the signer
	checkTxSignature(tx) {
	  // TODO: 
	  // - check the signature of a tx and return a boolean
	  // - return an error if the signature is invalid
	  // - return true if the tx is valid
	}

	// Checks if the user's address is already in the state, and if not, adds the user's address to the state
	checkUserAddress(tx) {
	  // TODO:
	  // - check if the sender is in the state
	  // - check if the receiver is in the state
	  // - if either the sender or the receiver is not in the state, add their address to the state, initialize the balance at 0, and loop back through the function
	  // - if the checks on both accounts pass (they're both in the state), return true
	}

	// Checks the transaction type and ensures that the transaction is valid based on that type
	checkTxType(tx) {
	  // TODO:
	  // - if mint, check that the sender is PayPal
	  // - if send, check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount 
	  // - if a check fails, return an error stating why
	  // - if a check passes, return true
	}

	// Updates account balances according to a transaction and adds the transaction to the history
	processTransaction(tx) {
	  // TODO:
	  // - decrease the balance of the transaction sender/signer
	  // - increase the balance of the transaction receiver 
	  // - add the transaction to the transaction history
	}

    // Checks if a transaction is valid, adds it to the transaction history, and updates the state of accounts and balances
    stateTransitionFunction(transaction) {
	  // TODO: 
	  // - check that the transaction signature is valid
	  // - check that the transaction sender and receiver are in the state
	  // - check that the transaction type is valid
	  // - process the transaction and add it to the transaction history
    }
}

module.exports = Paypal;
