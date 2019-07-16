## Using Keccak-256

Complete the `toHash` function.

You should be able to pass in some data to the function and it should return the `keccak256` hash of that data. Use `EthCrypto.hash.keccak256` ([Documentation](https://github.com/pubkey/eth-crypto#sign)). 

## Creating Keys

Now, let's see digital signatures in action! In order to sign messages, you’ll need a public and private key! 

Inside of our client's `constructor`, assign `this.wallet` to  [`EthCrypto.createIdentity()`](https://github.com/pubkey/eth-crypto#createidentity) to create a public key, private key, and Ethereum address. 

## Digital Signatures

We use our private key in order to sign messages. Let's create a method function `sign(data)` in our Client class.

This function should take in `data`, use `this.toHash` calculate the `hash` of that `data`, and then use [`EthCrypto.sign`](https://github.com/pubkey/eth-crypto#sign) and your wallet's private key to sign that hash. The function should return the resulting signature.

> *Hint*: `console.log(this.wallet)` to figure out how to access your private key. 

## Verifying Signatures

Digital Signatures allow anyone to use someone's address to verify that that used their private key to sign a message. If someone sends us a signed message, we'd like our client to be able to verify that their signature is valid.

Write a `verify` method that takes in 3 parameters (in this order):

1. `signature` - Sender's signature
2. `message` - Hash of the sender's message
3. `sender` - Sender's Ethereum address 

This function should return true if the signature is valid and false if it is not. 

> *Hint*: You can use [`EthCrypto.recover`](https://github.com/pubkey/eth-crypto#recover) to recover an Ethereum address from a `signature` and `messageHash`. See "Details" to learn how this function works.



