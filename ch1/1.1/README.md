> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).  

# Section 1.1 - Hashes and Signatures

Welcome to the first coding assignment of Cryptoeconomics.study! This assignment will walk you through using cryptographic hash functions, creating a public/private key pair, and verifying digital signatures. 

To do this we're going to use the EthCrypto library. This is a Javascript library that implements many cryptographic functions used in Ethereum. To get familiar with the library, check out their ([documentation](https://github.com/pubkey/eth-crypto))

## Getting Started

We're starting at Section 1.1, so cd into Section 1.1 of the Chapter 1 folder `/c1_CentralPaymentOperator/1.1-Hashes_and_Signatures`. You'll be editing the Client.js file in the root (aka not a subdirectory) of this folder to complete this assignment.

## Creating A Client

We're going to start by creating a [client](https://en.wikipedia.org/wiki/Client_%28computing%29) for our centralized payment operator. A client is a piece of software that allows an end-user to interact with the network. In bitcoin and Ethereum this is a node (full client) or wallet (light client), and in the more centralized operator space the equivalent would be an app or website you use to connect to the centralized service. Here our client will allow users to send transactions to the central operator to be processed. 

> More info on clients
> [Wikipedia](https://en.wikipedia.org/wiki/Client_%28computing%29)
> [Bitcoin](https://en.bitcoin.it/wiki/Clients#Overview)
> [Ethereum Docs](http://ethdocs.org/en/latest/ethereum-clients/choosing-a-client.html) 
> [Ethereum Wiki](https://github.com/ethereum/wiki/wiki/Clients,-tools,-dapp-browsers,-wallets-and-other-projects)

## Hashing

Complete the `toHash` function.

You should be able to pass in some data to the function and it should return the `keccak256` hash of that data. Use `EthCrypto.hash.keccak256`. 

> *Hint*: Check out the [EthCrpto documentation](https://github.com/pubkey/eth-crypto#sign) to learn how to use `EthCrypto.hash.keccak256()`.

## Creating Keys

Now, let's see digital signatures in action! In order to sign messages, you’ll need a public and private key! 

Inside of our client's `constructor`, assign `this.wallet` to  [`EthCrypto.createIdentity()`](https://github.com/pubkey/eth-crypto#createidentity) to create a public key, private key, and Ethereum address. 

> *Hint*: This assumes a knowledge of Javascript basics like classes and constructors. If this doesn't make sense yet, check out the Javascript section of our [Getting Started Guide](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup)
> [relevant documentation](https://github.com/pubkey/eth-crypto#createidentity)

## Creating Digital Signatures

We use our private key in order to sign messages. Let's create a method function `sign(data)` in our Client class.

This function should take in `data`, use `this.toHash` calculate the `hash` of that `data`, and then use [`EthCrypto.sign`](https://github.com/pubkey/eth-crypto#sign) and your wallet's private key to sign that hash. The function should return the resulting signature.

> *Hint*: `console.log(this.wallet)` to figure out how to access your private key. 
> [relevant documentation](https://github.com/pubkey/eth-crypto#sign)

## Verifying Digital Signatures

Digital Signatures allow anyone to use someone's address to verify that that used their private key to sign a message. If someone sends us a signed message, we'd like our client to be able to verify that their signature is valid.

Write a `verify` method that takes in 3 parameters (in this order):

1. `signature` - Sender's signature
2. `message` - Hash of the sender's message
3. `sender` - Sender's Ethereum address 

This function should return true if the signature is valid and false if it is not. 

> *Hint*: You can use [`EthCrypto.recover`](https://github.com/pubkey/eth-crypto#recover) to recover an Ethereum address from a `signature` and `messageHash`. See "Details" to learn how this function works.
> [relevant documentation](https://github.com/pubkey/eth-crypto#recover)

## Testing

Testing is a very important part of programming. Good testing will make us better, checking that our code actually does what we think it does. Bad testing will make us sloppy. Don't be sloppy. Run the tests. Make sure your code actually works. To ease this burden, we've already written the tests for you. All you have to do is run `mocha test` in this directory (`1.1`). 

`$ mocha test`

If all the tests don't pass, it's ok. That's what tests are for! Test exist to show you where your code breaks so that you can improve it. If all your tests are always passing it means you're probably not writing very good tests. Keep trying until the tests pass. If you really need help, reach out to other students on the [forum](https://forum.cryptoeconomics.study).

If all the tests do pass, congratulations! You did it. Move on to the next section whenever you're ready. 

