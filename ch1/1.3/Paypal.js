const EthCrypto = require("eth-crypto");
const Client = require("./Client.js");

// Our naive implementation of a centralized payment processor
class Paypal extends Client {
	// initialize Paypal's state
  constructor(genesis) {
    super();
    // the state of the network (accounts and balances)
    this.state = {
			// Paypal's address
      [this.wallet.address]: {
				// Paypal's initial balance
				balance: 1000000,
				// Paypal's initial nonce
				// TODO
      }
    };
		// pending transaciton bool
		// TODO
    // the history of transactions
    this.txHistory = [];
  }

  // Checks that the sender of a transaction is the same as the signer
  checkTxSignature(tx) {
    // check the signature of a transaction and return a boolean
    const sig = this.verify(tx.sig, this.hash(tx.contents), tx.contents.from);
    // return an error if the signature is invalid
    if (!sig) {
      console.log("Invalid Signature");
      return false;
      // return true if the transaction is valid
    } else {
      return true;
    }
  }

  // Check if the user's address is already in the state, and if not, add the user's address to the state
  checkUserAddress(tx) {
    // check if the sender is in the state
    if (!(tx.contents.to in this.state)) {
			// if the sender is not in the state, add their address and initialize an empty balance and nonce of 0
      this.state[tx.contents.to] = {
				balance: 0,
				nonce: 0
      };
    }
    // check if the receiver is in the state
    if (!(tx.contents.from in this.state)) {
			// if the receiveer is not in the state, add their address and initialize an empty balance and nonce of 0
      this.state[tx.contents.from] = {
				balance: 0,
				nonce: 0
      };
    }
    // if the checks on both accounts pass (they're both in the state), return true
    return true;
  }

	// Check that the transaction nonce matches the nonce that Paypal has for the sender's account
	// note: we first have to make sure that the account is in Paypal's state before we can check it's nonce
	checkTxNonce(tx) {
		// if the transaction nonce is greater than the nonce Paypal has for that account
		// TODO
			// and if the transaction is not already in the pendingTX pool
			// TODO
				// add the transaction to the pendingTx pool
				// TODO
			// return false to signal that nothing more needs to be done and the transaction does not need to be processed
			// TODO
		// if the transaction nonce is the same as the nonce Paypal has for that account
		// TODO
			// return true to signal that it is ok to proceed to the nex operation
			// TODO
		// if the transaction nonce is less than the nonce Paypal has for that account
			// TODO
			// return false to signal that the transaction is invalid and the transaction should not be processed
				// TODO
	}

  // Check that the transaction is valid based on the type
  checkTxType(tx) {
    // if mint
    if (tx.contents.type === "mint") {
			// check that the sender is PayPal
      if (tx.contents.from !== this.wallet.address) {
        // if a check fails, return an error stating why
        console.log("Non-Paypal Clients can't mint!");
        return false;
      }
      // if a check passes, return true
      return true;
    }
    // if check
    if (tx.contents.type === "check") {
      const user = tx.contents.from;
      console.log(`Your balance is: ${this.state[user].balance}`);
      // return false so that the stateTransitionFunction does not process the tx
      return false;
    }
    // if send
    if (tx.contents.type === "send") {
			// check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount
      if (this.state[tx.contents.from].balance - tx.contents.amount < 0) {
        // if a check fails, print an error to the console stating why and return false
        console.log("Not enough money!");
        return false;
      }
      // if a check passes, return true
      return true;
    }
		// if cancel
		if (tx.contents.type === 'cancel') {
			// get the nonce of the transaction to be cancelled
			// TODO
			// check pending transactions
				// TODO
				// if the nonce of the transaction to be cancelled matches a pending transaction
					// TODO
					// make sure that the user who is cancelling the transaction is the same user who signed the transaction to be cancelled
					// TODO
						// delete the old transaction
						// TODO
			// check already processed transactions
			// TODO
				// if the nonce matches delete the transaction and reverse the old transaction
				// TODO
					// make sure that the user who is cancelling the transaction is the same user who signed the transaction to be cancelled
					// TODO
						// take money back from the receiver
						// TODO
						// give the sender back their money
						// TODO
			// add the cancelation transaction to the txHistory
			// TODO
			// charge a fee to the user for cancelling a transaction
			// TODO
			// add that fee to Paypal's wallet balance
			// TODO
		}
  }

  // Checks if a transaction is valid
  checkTx(tx) {
    // check that the signature is valid
    if (this.checkTxSignature(tx)) {
      // check that the sender and receiver are in the state
      if (this.checkUserAddress(tx)) {
        // check that the type is valid
        if (this.checkTxType(tx)) {
					// check that the nonce is valid
					// TODO
						// if all checks pass return true
						return true;
					}
        }
      }
    // if any checks fail return false
    return false;
    }

  // Updates account balances according to the transaction, then adds the transaction to the history
  applyTx(tx) {
    // first decrease the balance of the transaction sender/signer
    this.state[tx.contents.from].balance -= tx.contents.amount;
    // then increase the balance of the transaction receiver
    this.state[tx.contents.to].balance += tx.contents.amount;
		// then incriment the nonce of the transaction sender
		this.state[tx.contents.from].nonce += 1;
    // then add the transaction to the transaction history
    this.txHistory.push(tx);
    // return true once the transaction is processed
    return true;
  }

	// Processes pending TX
  processPendingTx() {
		// for every transaction in the pendingTx pool
		// TODO
			// get the sender address
			// TODO
			// get the nonce Paypal has for that account
			// TODO
			// get the nonce on the transaction
			// TODO
			// if the nonce Paypal has for an account matches the nonce that is on the transaction
			// TODO
				// copy the pending transaction into memory
				// TODO
				// delete the transaction from the pendingTx pool
				// TODO
				// process the transaction
				// TODO
				// note: it is important to delete the transaction form the pendingTx pool BEFORE processing the transaction, otherwise we could get stuck in an infinite loop processing transactions and never deleting them
	}

	// Checks if a transaction is valid, then processes it, then checks if there are any valid transactions in the pending transaction pool and processes those too
	processTx(tx) {
		// check the transaction is valid
		if (this.checkTx(tx)) {
			// apply the transaction to Paypal's state
			this.applyTx(tx);
			// check if any pending transactions are now valid, and if so process them too
			this.processPendingTx()
		}
	}
}

// export the Paypal module so that other files can use it
module.exports = Paypal;
