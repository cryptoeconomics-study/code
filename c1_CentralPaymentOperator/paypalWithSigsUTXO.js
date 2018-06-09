var EthCrypto = require('eth-crypto')

var accounts = {
  'paypal': EthCrypto.createIdentity(),
  'aparna': EthCrypto.createIdentity(),
  'jing': EthCrypto.createIdentity()
}

var initialState = {
  utxos: [0],
  txOutputs: [{value: 1000, owner: accounts.paypal.address}]
}

var unsignedTxs = [
  {
    inputs: [0],
    outputs: [
      {value: 250, owner: accounts.jing.address},
      {value: 250, owner: accounts.aparna.address},
      {value: 500, owner: accounts.paypal.address}
    ]
  },
  {
    inputs: [1, 2],
    outputs: [
      {value: 500, owner: accounts.paypal.address}
    ]
  }
]

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

var signedTxs = [
  {
    contents: unsignedTxs[0],
    sigs: [EthCrypto.sign(accounts.paypal.privateKey, getTxHash(unsignedTxs[0]))]
  },
  {
    contents: unsignedTxs[1],
    sigs: [
      EthCrypto.sign(accounts.jing.privateKey, getTxHash(unsignedTxs[1])),
      EthCrypto.sign(accounts.aparna.privateKey, getTxHash(unsignedTxs[1]))
    ]
  }
]

function applyTransaction (state, tx) {
  // Recover addresses for all signatures
  const signers = []
  for (let sig of tx.sigs) {
    signers.push(EthCrypto.recover(sig, getTxHash(tx.contents)))
  }
  let totalInputValue = 0
  // Check that all inputs are indeed unspent, and that we have the signature for the owner
  for (let inputIndex of tx.contents.inputs) {
    const input = state.txOutputs[inputIndex]
    if (!signers.includes(input.owner)) {
      throw new Error('Missing signature for: ' + input.owner)
    }
    if (state.utxos[inputIndex] !== 0) {
      throw new Error('Trying to spend spent tx output!')
    }
    // Add to the total input value
    totalInputValue += input.value
  }
  let totalOutputValue = 0
  for (let output of tx.contents.outputs) {
    totalOutputValue += output.value
  }
  if (totalInputValue !== totalOutputValue) {
    throw new Error('Non-equal input and output values!')
  }
  // Update the state object!
  // First make the inputs spent
  for (let inputIndex of tx.contents.inputs) {
    state.utxos[inputIndex] = 1
  }
  // Next append the outputs to our list of outputs and add a 0 to our list of utxos
  for (let output of tx.contents.outputs) {
    state.txOutputs.push(output)
    state.utxos.push(0)
  }
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
  contents: unsignedTxs[1],
  sigs: [EthCrypto.sign(accounts.paypal.privateKey, getTxHash(unsignedTxs[1]))]
}

try {
  applyTransaction(state, invalidSigTx)
} catch (err) {
  console.log('We caught the error!', err)
}

// Now let's try replaying a tx and see if we catch it
try {
  applyTransaction(state, signedTxs[1])
} catch (err) {
  console.log('We caught the error!', err)
}
// Woot!
console.log('Success!')
