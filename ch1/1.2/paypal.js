const EthCrypto = require('eth-crypto');
const Client = require('./client.js');

// Our naive implementation of a centralized payment processor
class Paypal extends Client {
  constructor() {
    super();
    // the state of the network (accounts and balances)
    this.state = {
      [this.wallet.address]: {
        balance: 1000000,
      },
    };
    // the history of transactions
    this.txHistory = [];
  }

  // Checks that the sender of a transaction is the same as the signer
  checkTxSignature(tx) {
    // get the signature from the transaction
    // TODO
    // if the signature is invalid print an error to the console and return false
    // TODO
    // return true if the transaction is valid
    // TODO
  }

  // Checks if the user's address is already in the state, and if not, adds the user's address to the state
  checkUserAddress(tx) {
    // check if the sender is in the state
    // TODO
    // if the sender is not in the state, create an account for them
    // TODO
    // check if the receiver is in the state
    // TODO
    // if the receiver is not in the state, create an account for them
    // TODO
    // once the checks on both accounts pass (they're both in the state), return true
    // TODO
  }

  // Checks the transaction type and ensures that the transaction is valid based on that type
  checkTxType(tx) {
    // if the transaction type is 'mint'
    // TODO
    // check that the sender is PayPal
    // TODO
    // if the check fails, print an error to the concole stating why and return false so that the transaction is not processed
    // TODO
    // if the check passes, return true
    // TODO
    // if the transaction type is 'check'
    // TODO
    // print the balance of the sender to the console
    // TODO
    // return false so that the stateTransitionFunction does not process the tx
    // TODO
    // if the transaction type is 'send'
    // TODO
    // check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount
    // if a check fails, print an error to the console stating why and return false
    // TODO
    // if the check passes, return true
    // TODO
  }

  // Checks if a transaction is valid, adds it to the transaction history, and updates the state of accounts and balances
  checkTx(tx) {
    // check that the transaction signature is valid
    // TODO
    // check that the transaction sender and receiver are in the state
    // TODO
    // check that the transaction type is valid
    // TODO
    // if all checks pass return true
    // TODO
    // if any checks fail return false
    // TODO
  }

  // Updates account balances according to a transaction and adds the transaction to the history
  applyTx(tx) {
    // decrease the balance of the transaction sender/signer
    // TODO
    // increase the balance of the transaction receiver
    // TODO
    // add the transaction to the transaction history
    // TODO
    // return true once the transaction is processed
    // TODO
  }

  // Process a transaction
  processTx(tx) {
    // check the transaction is valid
    // TODO
    // apply the transaction to Paypal's state
    // TODO
  }
}

module.exports = Paypal;
