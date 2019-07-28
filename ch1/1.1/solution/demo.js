const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')

console.log('/////////////////////////////////////')
console.log('// Hashing and Public/Private Keys //')
console.log('/////////////////////////////////////')

// Hashing A Message
console.log('\nLet\'s hash a message!')
const message = 'Hello World'
console.log('The message is: ', message)
const messageHash = EthCrypto.hash.keccak256(message)
console.log('The hash of that message is: ', messageHash)

// Creating Public/Private Keys
console.log('\nCreating public/private key pairs to sign and verify messages.')

// Init Alice 
const alice = new Client()
console.log('Init Alice\'s Client\n', alice)

// Init Bob
const bob = new Client()
console.log('Init Bob\'s Client\n', bob)

// Init Carol
const carol = new Client()
console.log('Init Carol\'s Client\n', carol)

// Note
console.log('Notice that on their own Alice, Bob, and Carol just have keys. In order to have accounts that can hold tokens they need to connect to a network. The Paypal network is one such network, but Bitcoin and Ethereum are also networks. The state of the network is what determines account balances, so how the network operates is very important to users.')
console.log('Btw, you might notice that the public key is different than the address. This is because Ethereum addresses are generated from public, but are not exactly the same thing. Here\'s more info on that process: https://ethereum.stackexchange.com/questions/3542/how-are-ethereum-addresses-generated/3619#3619')

// Signing Messages
console.log('\nSigning Messages')
const messageFromAlice = 'My name is Alice'
console.log('Alice\'s message: ', messageFromAlice)
const hashedMessageFromAlice = alice.hash(messageFromAlice)
console.log('Now Alice has hashed her message:', hashedMessageFromAlice)
const signedMessageFromAlice = alice.sign(messageFromAlice)
console.log('Alice\'s message signature: ', signedMessageFromAlice)

// Verifying Messages
console.log('\nLet\'s help Bob verify Alice\'s message')
console.log('To do this we need to verify the message signature and the message hash to see if they return Alice\'s address')
const isMessageFromAliceAuthentic = bob.verify(signedMessageFromAlice, hashedMessageFromAlice, alice.wallet.address)
console.log('Is the message authentic?')
console.log(isMessageFromAliceAuthentic)

// Note
console.log('\nWhile this may seem like a silly example, message signing and verification allows us to securely connect to websites, download files from servers, and run any public blockchain network!\n')








/*
console.log('//////////////////////////////////////////')

const identity = EthCrypto.createIdentity();
console.log(identity)
const identityAddress = identity.address;
console.log(identityAddress)
console.log(identity.privateKey)

const message = 'foobar';
console.log(message)
const messageHash = EthCrypto.hash.keccak256(message);
console.log(messageHash)
const signature = EthCrypto.sign(
  identity.privateKey, // privateKey
  messageHash // hash of message
);
console.log(signature)

const recoveredAddress = EthCrypto.recover(signature, messageHash)
console.log(recoveredAddress)

console.log(identity.address === recoveredAddress)

console.log('///////////////////////////////////////////')

console.log('\nCREATING A CLIENT')
const identity2 = new Client();
console.log(identity2)
const identityAddress2 = identity2.wallet.address;
console.log(identityAddress2)
console.log(identity2.wallet.privateKey)


console.log('\nSIGNING THE MESSAGE')
const message2 = 'foobar';
console.log(message2)
const messageHash2 = identity2.hash(message2);
console.log(messageHash2)

const signature2 = EthCrypto.sign(
  identity2.wallet.privateKey, // privateKey
  messageHash2 // hash of message
);
console.log(signature2)

const signature3 = identity2.sign(message2)
console.log(signature3)


console.log('\nRECOVERING THE ADDRESS')
const recoveredAddress2 = EthCrypto.recover(signature2, messageHash2)
console.log(recoveredAddress2)

console.log(identity2.wallet.address === recoveredAddress2)
const verify2 = identity2.verify(signature2, messageHash2, identity2.wallet.address)
console.log(verify2)


console.log('\nCREATING A NEW CLIENT')
const identity3 = new Client();
console.log(identity3)

const verify3 = identity3.verify(signature2, messageHash2, identity2.wallet.address)
console.log(verify3)
*/
