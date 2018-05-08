var EthCrypto = require('eth-crypto')
var network = require('./networksim')()

const paypalIdentity = EthCrypto.createIdentity()
const genesis = {
  [paypalIdentity.address]: {
    balance: 10000000000000,
    nonce: 0
  }
}

class Node {
  constructor ({address, privateKey, publicKey}, name, genesis, network) {
    this.address = address
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.name = name
    this.network = network
    this.state = genesis
  }

  onReceive (tx) {
    this.state = applyTransaction(this.state, tx)
  }

  tick () {
    // TODO: If possible, attempt to generate a send transaction
    // Broadcast this tx to the network
  }
}

let test = new Node(paypalIdentity, 'paypal', genesis, network)
console.log('YOLO', test)

var nodes = {
  'paypal': Object.assign(EthCrypto.createIdentity(), {state: {}}),
  'aparna': Object.assign(EthCrypto.createIdentity(), {state: {}}),
  'jing': Object.assign(EthCrypto.createIdentity(), {state: {}})
}

var unsignedTxs = [
  {
    type: 'mint',
    amount: 100,
    from: nodes.paypal.address,
    to: nodes.paypal.address,
    nonce: 0
  },
  {
    type: 'send',
    amount: 65,
    from: nodes.paypal.address,
    to: nodes.aparna.address,
    nonce: 1
  },
  {
    type: 'send',
    amount: 10,
    from: nodes.aparna.address,
    to: nodes.jing.address,
    nonce: 0
  }
]

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

var signedTxs = [
  {
    contents: unsignedTxs[0],
    sig: EthCrypto.sign(nodes.paypal.privateKey, getTxHash(unsignedTxs[0]))
  },
  {
    contents: unsignedTxs[1],
    sig: EthCrypto.sign(nodes.paypal.privateKey, getTxHash(unsignedTxs[1]))
  },
  {
    contents: unsignedTxs[2],
    sig: EthCrypto.sign(nodes.aparna.privateKey, getTxHash(unsignedTxs[2]))
  }
]

function applyTransaction (state, tx) {
  // Check the from address matches the signature
  const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents))
  if (signer !== tx.contents.from) {
    throw new Error('Invalid signature!')
  }
  // If we don't have a record for this address, create one
  if (!(tx.contents.to in state)) {
    state[[tx.contents.to]] = {
      balance: 0,
      nonce: -1
    }
  }
  // Check that the nonce is correct for replay protection
  if (tx.contents.nonce !== state[[tx.contents.from]].nonce + 1) {
    throw new Error('Invalid nonce!')
  }
  // Mint coins **only if identity is PayPal**
  if (tx.contents.type === 'mint' && tx.contents.from === nodes.paypal.address) {
    state[[tx.contents.to]].balance += tx.contents.amount
  } else if (tx.contents.type === 'send') { // Send coins
    if (state[[tx.contents.from]].balance - tx.contents.amount < 0) {
      throw new Error('Not enough money!')
    }
    state[[tx.contents.from]].balance -= tx.contents.amount
    state[[tx.contents.to]].balance += tx.contents.amount
  }
  state[[tx.contents.from]].nonce += 1
  return state
}

// Apply all transactions for Paypal and print out all intermediate state
for (let i = 0; i < signedTxs.length; i++) {
  nodes.paypal.state = applyTransaction(nodes.paypal.state, signedTxs[i])
  console.log(('State at time ' + i), nodes.paypal.state)
}

// Just for fun, let's try signing aparna's transaction with jing's privatekey and see if we catch it
const invalidSigTx = {
  contents: unsignedTxs[2], // aparna sending jing 10
  sig: EthCrypto.sign(nodes.jing.privateKey, getTxHash(unsignedTxs[2]))
}

try {
  applyTransaction(nodes.paypal.state, invalidSigTx)
} catch (err) {
  console.log('We caught the error!', err)
}

// Now let's try replaying a tx and see if we catch it
try {
  applyTransaction(nodes.paypal.state, signedTxs[2])
} catch (err) {
  console.log('We caught the error!', err)
}
// Woot!
console.log('Success!')
