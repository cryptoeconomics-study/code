## Payment Processor Overview

We’re going to extend our Client from Section 1.1 to add **state**, **transactions**, and our **state transition function**. Replace our Client.js file with your Client.js implementation from Section 1.1 

## Format Specifications

Our unsigned transactions will have format: 
```
{
    type: either 'send' or ‘mint’,
    amount: amount to send
    from: address of sender,
    to: address of receiver,
}
```
Because every transaction must have an accompanying signature, a transaction will have format:
```
{
    contents: unsignedTx,
    sig: signature
}
```

Lastly, our state will be an object mapping Ethereum addresses as keys to each account state. The account state will be an object containing a `balance`. Here is an example state: 

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

## Generating Transactions

Let’s add a `generateTx` function to our Client:
```
generateTx(to, amount, type) {
    //Create an unsigned transaction (see Details)
    //Create a digital signature of the transaction
    return //a transaction containing contents and sig (See Details) 
}
```

## State Transition Function

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

## Completion

Congrats on building your own Paypal client! But...it's not quite done yet. In section 1.3, we'll cover how our current Paypal client is vulnerable to **replay attacks** and we'll add some code to protect against these attacks!
