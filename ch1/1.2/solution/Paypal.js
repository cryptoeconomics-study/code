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
	  
	  // check the signature of a tx and return a boolean
	  const sig = this.verify(tx.sig, this.toHash(tx.contents), tx.contents.from);
	  // return an error if the signature is invalid
	  if (!sig) {
			throw new Error('Invalid Signature!');							
		// return true if the tx is valid
		} else {
			return true;
		}
	}

	// Checks if the user's address is already in the state, and if not, adds the user's address to the state
	checkUserAddress(tx) {
	  // TODO:
	  // - check if the sender is in the state
	  // - check if the receiver is in the state
	  // - if either the sender or the receiver is not in the state, add their address to the state, initialize the balance at 0, and loop back through the function
	  // - if the checks on both accounts pass (they're both in the state), return true

	  // check if the sender is in the state
	  if (!(tx.contents.to in this.state)) {
		  this.state[tx.contents.to] = {
			  balance: 0
		  }
	  }
	  // check if the receiver is in the state
	  if (!(tx.contents.from in this.state)) {
		  this.state[tx.contents.to] = {
			  balance: 0
		  }
	  }
	  // if the checks on both accounts pass (they're both in the state), return true
	  return true
	}

	// Checks the transaction type and ensures that the transaction is valid based on that type
	checkTxType(tx) {
	  // TODO:
	  // - if mint, check that the sender is PayPal
	  // - if send, check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount 
	  // - if a check fails, return an error stating why
	  // - if a check passes, return true

	  // if mint, check that the sender is PayPal
	  if (tx.contents.type === 'mint') {
		  if(tx.contents.from !== this.wallet.address) {
			  // if a check fails, return an error stating why
			  throw new Error('Non-Paypal Clients can\'t mint!')
		  }
	  // if send, check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount 
	  } else if (tx.contents.type === 'send') { // Send coins
		  if (this.state[tx.contents.from].balance - tx.contents.amount < 0) {
			  // if a check fails, return an error stating why
			  throw new Error('Not enough money!')
		  }
	  }
	  // if a check passes, return true
	  return true
	}

	// Updates account balances according to a transaction and adds the transaction to the history
	processTransaction(tx) {
	  // TODO:
	  // - decrease the balance of the transaction sender/signer
	  // - increase the balance of the transaction receiver 
	  // - add the transaction to the transaction history

	  // decrease the balance of the transaction sender/signer
	  this.state[tx.contents.from].balance -= tx.contents.amount
	  // increase the balance of the transaction receiver 
	  this.state[tx.contents.to].balance += tx.contents.amount
	  // add the transaction to the transaction history
	  this.transactionHistory.push(tx)
	}

    // Checks if a transaction is valid, adds it to the transaction history, and updates the state of accounts and balances
    stateTransitionFunction(transaction) {
	  // TODO: 
	  // - check that the transaction signature is valid
	  // - check that the transaction sender and receiver are in the state
	  // - check that the transaction type is valid
	  // - process the transaction and add it to the transaction history

	  // check that the transaction signature is valid
	  checkTxSignature(tx)
	  // check that the transaction sender and receiver are in the state
	  checkUserAddress(tx)
	  // check that the transaction type is valid
	  checkTxType(tx)
	  // process the transaction and add it to the transaction history
	  processTransaction(tx)
    }
}

module.exports = Paypal;
