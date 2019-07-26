> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).  

# Section 1.1 - Hashes and Signatures

Welcome to the first coding assignment of Cryptoeconomics.study! This assignment will walk you through using cryptographic hash functions, creating a public/private key pair, and verifying digital signatures. 

## Getting Started

We're starting at Section 1.1, so cd into Section 1.1 of the Chapter 1 folder `/c1_CentralPaymentOperator/1.1-Hashes_and_Signatures`. You'll be editing the Client.js file in the root (aka not a subdirectory) of this folder to complete this assignment.

In order to run tests on your work, cd into /test and run mocha test.js. Once you pass all the tests, you can move on to the next section!

## Hashing

Complete the `toHash` function.

You should be able to pass in some data to the function and it should return the `keccak256` hash of that data. Use `EthCrypto.hash.keccak256` ([EthCrypto Documentation](https://github.com/pubkey/eth-crypto#sign)). 

## Creating Keys

Now, let's see digital signatures in action! In order to sign messages, you’ll need a public and private key! 

Inside of our client's `constructor`, assign `this.wallet` to  [`EthCrypto.createIdentity()`](https://github.com/pubkey/eth-crypto#createidentity) to create a public key, private key, and Ethereum address. 

> This assumes a knowledge of Javascript basics like classes and constructors. If this doesn't make sense yet, check out the Javascript section of our [Getting Started Guide](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup)

## Creating Digital Signatures

We use our private key in order to sign messages. Let's create a method function `sign(data)` in our Client class.

This function should take in `data`, use `this.toHash` calculate the `hash` of that `data`, and then use [`EthCrypto.sign`](https://github.com/pubkey/eth-crypto#sign) and your wallet's private key to sign that hash. The function should return the resulting signature.

> *Hint*: `console.log(this.wallet)` to figure out how to access your private key. 

## Verifying Digital Signatures

Digital Signatures allow anyone to use someone's address to verify that that used their private key to sign a message. If someone sends us a signed message, we'd like our client to be able to verify that their signature is valid.

Write a `verify` method that takes in 3 parameters (in this order):

1. `signature` - Sender's signature
2. `message` - Hash of the sender's message
3. `sender` - Sender's Ethereum address 

This function should return true if the signature is valid and false if it is not. 

> *Hint*: You can use [`EthCrypto.recover`](https://github.com/pubkey/eth-crypto#recover) to recover an Ethereum address from a `signature` and `messageHash`. See "Details" to learn how this function works.

