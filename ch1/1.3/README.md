> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://cryptoeconomics.study/docs/en/sync/getting-started-development-setup).

<br />

## Nonces

In this section we're going to explore how to prevent replay protection via nonces. We'll also explore some other features like processing transactions asynchronously and cancelling transactions.

Let's start by adding nonces to our user clients and our centralized payments processor, starting each at 0.

> *Fun Fact*: The term *Nonce* stands for "**number** that can be used just **once**"

### Client Nonces

Our user facing clients need to add nonces to the account, then add the account's nonce to each transaction, and then increase the nonce for every new transaction.
```
// Initializes a public/private key pair for the user
constructor() {
	this.wallet = EthCrypto.createIdentity();
	// initialize the nonce
	// TODO
}

// Generates new transactions
generateTx(to, amount, type) {
	// create an unsigned transaction
	const unsignedTx = {
		type: type,
		amount: amount,
		from: this.wallet.address,
		to: to,
		// add wallet nonce to tx
		// TODO
	};
	// create a signature of the transaction
	const tx = {
		contents: unsignedTx,
		sig: this.sign(unsignedTx)
	};
	// increment the wallet's nonce parameter AFTER the tx object is created
	// TODO
	// return a Javascript object with the unsigned transaction and transaction signature
	return tx;
}
```

<br />

### Payments Processor Nonces

Our payments process needs to add nonces to every user's account, and then we need to create a function to check the nonces of each transaction we receive against the nonce of the sending in our state.

```
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
```

<br />

## Pending Transactions

Something that we'll be talking about a lot in Chapter 2 is networks and latency. If we send packet A over the internet to Paypal and then send packet B to Paypal, there's no guarantee that Paypal will receive the packets in the order they were sent. So, if I intend to send a $10 transaction to Alice with `nonce` 0 and then send a $10 transaction to Bob with `nonce` 1, Paypal might receive the transaction with `nonce` 1 first and reject it.

In order to mitigate this problem, if we receive a transaction from Alice with a nonce greater than `this.state[ALICE_ADDRESS].nonce`, we want Paypal to store that transaction in a list of pending transactions that we'll call `pendingTx` and apply it once its nonce is valid.

```
// pending transaciton bool
// TODO
// the history of transactions
this.txHistory = [];

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
```

<br />

## Cancelling Transactions

Now that we can track transactions with nonces, we can cancel them! That's right, because it's a central database we can change the state arbitrarily, for a small fee of course...
```
// Check that the transaction is valid based on the type
checkTxType(tx) {
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
```

<br />

## Testing

We recommend building each function, testing it out in `demo.js` to see how it works (`node demo.js`), then you've got that working run the mocha tests to make sure it passes (`mocha`). If you need help our wonderful community is just a [click](https://forum.cryptoeconomics.study) away :)

If all your tests, pass.... congratulations! :)

<br />
