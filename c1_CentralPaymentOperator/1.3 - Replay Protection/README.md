## 1.3 - Replay Protection
Replace our Client.js and Paypal.js files with your Client.js and Paypal.js implementations from Section 1.2.


## Adding Nonces

Hopefully Karl's lecture gave you a good understanding of why we need to add `nonces` to our transactions to prevent *Replay Attacks*!

To use nonces in `Client.js`, you will need to:

* Initialize `this.nonce` to 0 in the constructor
    * Note: we want our first generated transaction to have nonce 0
* Add a `nonce` property to our `unsignedTx` in `generateTx`. 
* `this.nonce` should increment after every `generateTx` call

To use nonces in `applyTransaction` of `Paypal.js`, you will need to:
* In addition to `balance`, track everybody's `nonce` in `this.state`
* `nonce` is initialized to 0 for new accounts. 
* Do nothing to the state if the `nonce` of `tx` is incorrect
* Increment the transaction sender's `nonce` after applying a transaction successfully
* If the transaction sender doesn't exist in `this.state`, we will need to add them to increment their nonce!

> *Fun Fact*: The term *Nonce* stands for "**number** that can be used just **once**"

## Pending Transactions

Something that we'll be talking about a lot in Chapter 2 is networks and latency. If we send packet A over the internet to Paypal and then send packet B to Paypal, there's no guarantee that Paypal will receive the packets in the order they were sent. So, if I intend to send a $10 transaction to Alice with `nonce` 0 and then send a $10 transaction to Bob with `nonce` 1, Paypal might receive the transaction with `nonce` 1 first and reject it. 

In order to mitigate this problem, if we receive a transaction from Alice with a nonce greater than `this.state[ALICE_ADDRESS].nonce`, we want Paypal to store that transaction in a list of pending transactions that we'll call `invalidNonceTxs` and apply it once its nonce is valid.

To add `Pending Transactions` in `Paypal.js`, you will need to:

* In your constructor, initialize `this.invalidNonceTxs = {}`
    * Your invalidNonceTxs data structure should be a mapping from address to a mapping of invalid nonce to transaction. 
    * E.g. if we received a transaction from Alice that has a nonce of 1, when we expected one with nonce 0, then `Paypal` would have:
    ```
    this.invalidNonceTxs =
        {
            [ALICE_ADDRESS]: {
                1: {contents, sig} //transaction
            }
        }
    ```
* Create a new method, `onReceive(tx)`. 
    * This method will be called every time Paypal receives a new transaction.
    * It should call `applyTransaction(tx)`, and then
    * It should call a new function `applyInvalidNonceTxs()`, which should apply any of the `invalidNonceTxs` that are now valid transactions.

> Example: 

> * Alice's nonce in Paypal.state is 0. 
* Paypal receives a transaction from Alice sending $10 to Bob, with a nonce of 1. 
* Paypal stores this transaction in Paypal.invalidNonceTxs. 
* Later, Paypal receives a transaction from Alice sending $20 to Karl, with a nonce of 0. 
* In Paypal's onReceive(tx) function, Paypal should apply the $20 transaction from Alice to Karl calling `applyTransaction(tx)`, and then call `applyInvalidNonceTxs()`. 
* Now that the expected nonce from Alice is 1, `applyInvalidNonceTxs()` should apply the transaction that had a nonce of 1 from Alice sending $10 to Bob and remove that transaction from `this.invalidNonceTxs`.

## Completion

Our payment processor is complete! Just in case it was too easy for you, up next is Section 1.4, where we'll be re-factoring what we've built to use UTXOs, the format of transactions used by **Bitcoin**. 
