var EthCrypto = require('eth-crypto')

var initialState = {}

/* Signed transaction format
tx = {
  contents: {
    type: string,  // either 'mint' or 'send'
    amount: int,   // some quantity of coins
    from: string,  // the address of the sender
    to: string,    // the address of the recipient
  },
  sig: string      // the signature of the sender
}
*/

var accounts = {
  'paypal': EthCrypto.createIdentity(),
  'aparna': EthCrypto.createIdentity(),
  'jing': EthCrypto.createIdentity()
}

var unsignedTxs = [
  {
    type: 'mint',
    amount: 100,
    from: accounts.paypal.address,
    to: accounts.paypal.address,
    nonce: 0
  },
  {
    type: 'send',
    amount: 65,
    from: accounts.paypal.address,
    to: accounts.aparna.address,
    nonce: 1
  },
  {
    type: 'send',
    amount: 10,
    from: accounts.aparna.address,
    to: accounts.jing.address,
    nonce: 0
  }
]

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

var signedTxs = [
  {
    contents: unsignedTxs[0],
    sig: EthCrypto.sign(accounts.paypal.privateKey, getTxHash(unsignedTxs[0]))
  },
  {
    contents: unsignedTxs[1],
    sig: EthCrypto.sign(accounts.paypal.privateKey, getTxHash(unsignedTxs[1]))
  },
  {
    contents: unsignedTxs[2],
    sig: EthCrypto.sign(accounts.aparna.privateKey, getTxHash(unsignedTxs[2]))
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
  if (tx.contents.type === 'mint' && tx.contents.from === accounts.paypal.address) {
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

// Apply all transactions and print out all intermediate state
let state = initialState
for (let i = 0; i < signedTxs.length; i++) {
  state = applyTransaction(state, signedTxs[i])
  console.log(('State at time ' + i), state)
}

// Just for fun, let's try signing aparna's transaction with jing's privatekey and see if we catch it
const invalidSigTx = {
  contents: unsignedTxs[2], // aparna sending jing 10
  sig: EthCrypto.sign(accounts.jing.privateKey, getTxHash(unsignedTxs[2]))
}

try {
  applyTransaction(state, invalidSigTx)
} catch (err) {
  console.log('We caught the error!', err)
}

// Now let's try replaying a tx and see if we catch it
try {
  applyTransaction(state, signedTxs[2])
} catch (err) {
  console.log('We caught the error!', err)
}
// Woot!
console.log('Success!')
