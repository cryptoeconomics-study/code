const EthCrypto = require("eth-crypto");
const Client = require("./Client.js");

// Our naive implementation of a centralized payment processor
class Paypal extends Client {
  constructor(genesis) {
    super();
    // the state of the network (accounts and balances)
    this.state = {
			// Paypal's address
      [this.wallet.address]: {
				// Paypal's initial balance
				balance: 1000000,
				// Paypal's initial nonce
				nonce: 0,
      }
    };
    // the history of transactions
    this.txHistory = [];
		// pending transaciton bool
		this.pendingTX = [];
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

  // Checks if the user's address is already in the state, and if not, adds the user's address to the state
  checkUserAddress(tx) {
    // check if the sender is in the state
    if (!(tx.contents.to in this.state)) {
      this.state[tx.contents.to] = {
        balance: 0
      };
    }
    // check if the receiver is in the state
    if (!(tx.contents.from in this.state)) {
      this.state[tx.contents.from] = {
        balance: 0
      };
    }
    // if the checks on both accounts pass (they're both in the state), return true
    return true;
  }

  // Checks the transaction type and ensures that the transaction is valid based on that type
  checkTxType(tx) {
    // if mint, check that the sender is PayPal
    if (tx.contents.type === "mint") {
      if (tx.contents.from !== this.wallet.address) {
        // if a check fails, return an error stating why
        console.log("Non-Paypal Clients can't mint!");
        return false;
      }
      // if a check passes, return true
      return true;
    }
    // if check, return the balance of the sender
    if (tx.contents.type === "check") {
      const user = tx.contents.from;
      console.log(`Your balance is: ${this.state[user].balance}`);
      // return false so that the stateTransitionFunction does not process the tx
      return false;
    }
    // if send, check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount
    if (tx.contents.type === "send") {
      if (this.state[tx.contents.from].balance - tx.contents.amount < 0) {
        // if a check fails, print an error to the console stating why and return false
        console.log("Not enough money!");
        return false;
      }
      // if a check passes, return true
      return true;
    }
  }

  // Updates account balances according to a transaction and adds the transaction to the history
  processTransaction(tx) {
    // decrease the balance of the transaction sender/signer
    this.state[tx.contents.from].balance -= tx.contents.amount;
    // increase the balance of the transaction receiver
    this.state[tx.contents.to].balance += tx.contents.amount;
    // add the transaction to the transaction history
    this.txHistory.push(tx);
    // return true once the transaction is processed
    return true;
  }

  // Checks if a transaction is valid, adds it to the transaction history, and updates the state of accounts and balances
  stateTransitionFunction(tx) {
    // check that the transaction signature is valid
    if (this.checkTxSignature(tx)) {
      // check that the transaction sender and receiver are in the state
      if (this.checkUserAddress(tx)) {
        // check that the transaction type is valid
        if (this.checkTxType(tx)) {
          // if all checks pass process the transaction and add it to the transaction history
          this.processTransaction(tx);
          // return true if the state transition function is successful
          return true;
        }
      }
    }
    // return false if one of the state transition checks fails
    return false;
  }
}

module.exports = Paypal;
