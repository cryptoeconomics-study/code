> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).

<br />

## Payment Processor Overview

Now we’re going to create a centralized server for our centralized payment processor (PayPal). The PayPal server will have a database (`state`) and a function to process transactions (`processTx`). We're also going to extend our client (`client.js`) from Section 1.1 to allow users to create transactions.

<br />

## Updating The Client To Generate Transactions

To allow users to create transactions, we're going to give them a `generateTx()` function.

This will allow them to create a Javascript object with the transaction type, amount, sender (from), and receiver (to).
```
{
  type: either 'send' or ‘mint’,
  amount: amount to send
  from: address of sender,
  to: address of receiver,
}
```

We'll then use our `sign()` function to hash and sign that Javascript object
```
// a hash
0x123456789abcdefghijklmnopqrstuvwxyz12345
```

Then we'll put both of those into a Javascript object and that will be our transaction.
```
// a javascript object with both the unsigned tx and the tx signature
{
  contents: unsignedTx,
  sig: signature,
}
```

Note: because our demo does not have networking capabilities we can't actually "send" the transaction from the user's client to Paypal's servers, so in the demo we just manually initialize that process.

<br />

## Creating A Centralized Payments Processor

Our centralized payments processor has three main goals:
- managing a state of accounts and balances
- processing transactions
- recording a history of transactions

We're calling it Paypal, but the name is arbitrary. The goal is really just to show you how to create and manage a ledger of accounts and balances.

### State

The payment processor's state will be an object mapping addresses (client public keys) to balances (an integer in a javascript object). It might look something like this:
```
{
    0x129a2BF4B76f3e715E57b4B6CCE78cAf04C87465: {
        balance: 35
    },
    0x335C34fbe2dFC889c1e181d37Cf83a7B8Acfc572:{
        balance: 55
    },
    0x131836Cf31e7f36f5A48FfEb4d35FB07518D9F5C:{
        balance: 10
    }
}
```

### State Transition Function

The state transition function determines how the system operates. It is the rules that define the system. In other contexts this is sometimes called the protocol or runtime. Here we are going to create a state transition function called `processTx()` that allows our centralized payments processor to:
- check that the transaction is valid
- process the transaction and add it to the transaction history
```
// Process a transaction
processTx(tx) {
	// check the transaction is valid
	// TODO
		// apply the transaction to Paypal's state
		// TODO
}
```

The rules as to what is and is not a "valid" transaction are up to you, so as the chapter develops we'll add more and more rules to check. To make this easier to build, test, and modify we're going to break each of these components into their own function.

#### Check Transaction Signature
```
// Checks if the user's address is already in the state, and if not, adds the user's address to the state
checkTxSignature(tx) {
	// TODO
	// check the signature of a transaction
	// return an error if the signature is invalid
	// return true if the check passes
}
```

#### Check User Address
```
// Checks if the user's address is already in the state, and if not, adds the user's address to the state
verifyUserAddress(tx) {
  // TODO:
  // check if the sender is in the state
  // check if the receiver is in the state
  // if either the sender or the receiver is not in the state, add their address to the state, initialize the balance at 0, and loop back through the function
  // if the checks on both accounts pass (they're both in the state), return true
}
```

#### Check TX Type
```
// Checks the transaction type and ensures that the transaction is valid based on that type
checkTxType(tx) {
  // TODO:
  // if mint, check that the sender is PayPal
  // if check, print the user's balance to the console
  // if send, check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount
  // if a check fails, return an error stating why
  // if a check passes, return true
}
```

#### Process Transaction
```
// Updates account balances according to a transaction and adds the transaction to the history
processTransaction(tx) {
  // TODO:
  // decrease the balance of the transaction sender/signer
  // increase the balance of the transaction receiver
  // add the transaction to the transaction history
}
```

<br />

## Testing

As with `1.1`, we recommend building the first function, then testing it out in `demo.js` to see how it works (`node demo.js`). Once you've got that working, then run the mocha tests to make sure it passes (`mocha`). If you need help our wonderful community is just a [click](https://forum.cryptoeconomics.study) away :)

If all your tests, pass.... congrats on building your own centralized payments processor! But...it's not quite done yet. In section 1.3, we'll cover how our current Paypal client is vulnerable to **replay attacks** and we'll add some code to protect against these attacks.

<br />

