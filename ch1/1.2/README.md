> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).  

<br />

## Payment Processor Overview

Now we’re going to create a centralized server for our centralized payment processor (PayPal). The PayPal server will have a database (`state`) and a function to process transactions (`stateTransitionFunction`). We're also going to extend our client (`client.js`) from Section 1.1 to allow users to create transactions. 

<br />

## Updating The Client To Generate Transactions

### Transaction Format 

Transactions for our payment processor will be in this format.

#### Unsigned Transaction
```
// a javascript oject
{
  type: either 'send' or ‘mint’,
  amount: amount to send
  from: address of sender,
  to: address of receiver,
}
```

#### Transaction Signature
```
// a hash
0x123456789abcdefghijklmnopqrstuvwxyz12345
```

#### Transaction
```
// a javascript object with both the unsigned tx and the tx signature
{
  contents: unsignedTx,
  sig: signature,
}
```

### Generating Transactions

We need to add a function to our client that allows it to generate transactions in the format described above.
```
generateTx(to, amount, type) {
  // TODO:
  // - create an unsigned transaction
  // - create a signature of the transaction
  // - return a Javascript object with the unsigned transaction and transaction signature
}
```

<br />

## Creating A Centralized Payments Processor

Our centralized payments processor has three main goals:
- managing a state of accounts and balances
- processing transactions
- recording a history of transactions

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

### History

The history will keep track of all the transactions that the payments processor has ever processed. It might look something like this:
```
// note: these are not actual tx so the signatures here are not valid
{
  contents: {
	  type: 'send',
	  amount: 35, 
	  from: 0x131836Cf31e7f36f5A48FfEb4d35FB07518D9F5C,
	  to: 0x335C34fbe2dFC889c1e181d37Cf83a7B8Acfc572,
  },
  sig: 0x129a2BF4B76f3e715E57b4B6CCE78cAf04C87465,
},
{
  contents: {
	  type: 'send',
	  amount: 23, 
	  from: 0x131836Cf31e7f36f5A48FfEb4d35FB07518D9F5C,
	  to: 0x129a2BF4B76f3e715E57b4B6CCE78cAf04C87465,
  },
  sig: 0x335C34fbe2dFC889c1e181d37Cf83a7B8Acfc572,
{
  contents: {
	  type: 'send',
	  amount: 68, 
	  from: 0x131836Cf31e7f36f5A48FfEb4d35FB07518D9F5C,
	  to: 0x335C34fbe2dFC889c1e181d37Cf83a7B8Acfc572,
  },
  sig: 0x129a2BF4B76f3e715E57b4B6CCE78cAf04C87465,
},
},
```

### State Transition Function

The state transition function determines how the system operates. It is the rules that define the system. In other contexts this is sometimes called the protocol or runtime. Here we are going to create a state transition function that allows our centralized payments processor to:
- check that the transaction signature is valid
- check that the transaction sender and receiver are in the state
- check that the transaction type is valid
- process the transaction and add it to the transaction history
```
// Checks if a transaction is valid, adds it to the transaction history, and updates the state of accounts and balances
stateTransitionFunction(transaction) {
  // TODO: 
  // - check that the transaction signature is valid
  // - check that the transaction sender and receiver are in the state
  // - check that the transaction type is valid
  // - process the transaction and add it to the transaction history
}
```

We're going to break each of these components into their own function so that they are easier to read, test, and use. This will also make it easier to add or remove functionality later if we want. 

#### Check Transaction Signature
```
// Checks if the user's address is already in the state, and if not, adds the user's address to the state
verifyUserAddress(tx) {
  // TODO:
  // - check if the sender is in the state
  // - check if the receiver is in the state
  // - if either the sender or the receiver is not in the state, add their address to the state, initialize the balance at 0, and loop back through the function
  // - if the checks on both accounts pass (they're both in the state), return true
}
```

#### Check User Address
```
// Checks if the user's address is already in the state, and if not, adds the user's address to the state
verifyUserAddress(tx) {
  // TODO:
  // - check if the sender is in the state
  // - check if the receiver is in the state
  // - if either the sender or the receiver is not in the state, add their address to the state, initialize the balance at 0, and loop back through the function
  // - if the checks on both accounts pass (they're both in the state), return true
}
```

#### Check TX Type
```
// Checks the transaction type and ensures that the transaction is valid based on that type
checkTxType(tx) {
  // TODO:
  // - if mint, check that the sender is PayPal
  // - if send, check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount 
  // - if a check fails, return an error stating why
  // - if a check passes, return true
}
```

#### Process Transaction
```
// Updates account balances according to a transaction and adds the transaction to the history
processTransaction(tx) {
  // TODO:
  // - decrease the balance of the transaction sender/signer
  // - increase the balance of the transaction receiver 
  // - add the transaction to the transaction history
}
```

<br />

## Testing

This is where testing instructions will go. 

Congrats on building your own Paypal client! But...it's not quite done yet. In section 1.3, we'll cover how our current Paypal client is vulnerable to **replay attacks** and we'll add some code to protect against these attacks!

<br />
