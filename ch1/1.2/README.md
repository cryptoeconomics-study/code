> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).  

## Payment Processor Overview

Now we’re going to create a centralized server for our centralized payment processor (PayPal). The PayPal server will have a database (`state`) and a function to process transactions (`stateTransitionFunction`). We're also going to extend our client (`client.js`) from Section 1.1 to allow users to create transactions. 


## Creating A Centralized Payments Processor

Our centralized payments processor has three main goals:
- managing a state of accounts and balances
- processing transactions
- recording a history of transactions

### State

The payment processor's state will be an object mapping addresses (client public keys) to balances (an integer in a javascript object). Here is an example of what that state might look like: 
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

Here comes the meat of the protocol. We have our state and we can generate our transactions. Now we need to create our state transition function,
```
 applyTransaction(transaction) {
     //apply transaction to this.state
 }
```
This function applies a transaction to our Paypal client's state.
Things to check for: 

* Valid signature on the transaction
* If the address we're sending to is not already in the state, create a new entry in the state.

For `"spend"` transactions,

* If sender doesn't have enough money, throw an `Error`

For `"mint"` transactions,

* Doesn't decrease balance of sender
* If the sender is not Paypal, throw an `Error`


## Updating The Client To Generate Transactions

### Transaction Format 

Unsigned Transaction: 
```
// a javascript oject
{
    type: either 'send' or ‘mint’,
    amount: amount to send
    from: address of sender,
    to: address of receiver,
}
```

Transaction Signature:
```
// a hash
0x123456789abcdefghijklmnopqrstuvwxyz12345
```

Transaction:
```
// a javascript object with both the unsigned tx and the tx signature
{
    contents: unsignedTx,
    sig: signature
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

## Testing

This is where testing instructions will go. 


## Completion

Congrats on building your own Paypal client! But...it's not quite done yet. In section 1.3, we'll cover how our current Paypal client is vulnerable to **replay attacks** and we'll add some code to protect against these attacks!
