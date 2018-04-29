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
  'jing': EthCrypto.createIdentity(),
}

// TODO: Add nonces for replay protection
// To do this, simply add a nonce: int, and then store for each account
// both the balance and the current nonce. Then when transactions are
// added using `applyTransaction()`, add an additional check
// if (tx.contents.nonce !== state[[tx.contents.to]].nonce+1) { throw 'Invalid nonce!' }
// Note this requires changing the state object to look like { address: {balance: x, nonce: y} }
var unsignedTxs = [
  {
    type: 'mint',
    amount: 100,
    from: accounts.paypal.address,
    to: accounts.paypal.address
  },
  {
    type: 'send',
    amount: 65,
    from: accounts.paypal.address,
    to: accounts.aparna.address
  },
  {
    type: 'send',
    amount: 10,
    from: accounts.aparna.address,
    to: accounts.jing.address
  },
]

function getTxHash(tx) {
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

function applyTransaction(state, tx) {
  // Check the from address matches the signature
  const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents));
  if (signer !== tx.contents.from) {
    throw 'Invalid signature!'
  }
  // If we don't have a record for this address, create one
  if (!(tx.contents.to in state)) {
    state[[tx.contents.to]] = 0
  }
  // Mint coins **only if identity is PayPal**
  if (tx.contents.type === 'mint' && tx.contents.from === accounts.paypal.address) {
    state[[tx.contents.to]] += tx.contents.amount
  }
  // Send coins
  if (tx.contents.type === 'send') {
    if (state[[tx.contents.from]] - tx.contents.amount < 0) {
      throw 'Not enough money!'
    }
    state[[tx.contents.from]] -= tx.contents.amount
    state[[tx.contents.to]] += tx.contents.amount
  }
  return state
}

// Apply all transactions and print out all intermediate state
state = initialState
for(let i = 0; i < signedTxs.length; i++) {
  state = applyTransaction(state, signedTxs[i])
  console.log(('State at time ' + i), state)
}

// Just for fun, let's try signing aparna's transaction with jing's privatekey and see if we catch it
invalidTx = {
  contents: unsignedTxs[2],  // aparna sending jing 10
  sig: EthCrypto.sign(accounts.jing.privateKey, getTxHash(unsignedTxs[2]))
}

try {
  applyTransaction(state, invalidTx)
}
catch(err) {
  console.log('We caught the error!', err)
}
// Woot!
