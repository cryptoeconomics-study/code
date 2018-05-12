var EthCrypto = require('eth-crypto')
var network = require('./networksim')()

/*
 * Example Transactions

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
*/

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

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

class Node {
  constructor ({address, privateKey, publicKey}, genesis, network) {
    // Blockchain identity
    this.address = address
    this.privateKey = privateKey
    this.publicKey = publicKey
    // P2P Node identity -- used for connecting to peers
    this.p2pNodeId = EthCrypto.createIdentity()
    this.pid = this.p2pNodeId.address
    this.network = network
    this.state = genesis
    this.transactions = []
  }

  onReceive (tx) {
    if (!this.transactions.includes(tx)) {
      this.transactions.push(tx)
      console.log(this.pid, 'got', tx)
      this.network.broadcast(this.pid, tx)
    }
    // this.state = applyTransaction(this.state, tx)
  }

  tick () {
    // TODO: If possible, attempt to generate a send transaction
    // Broadcast this tx to the network
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 50
const identities = []
const genesis = {}
for (let i = 0; i < numNodes; i++) {
  // Create new identity
  identities.push(EthCrypto.createIdentity())
  // Add that node to our genesis block & give them an allocation
  genesis[identities[i].address] = {
    balance: 100,
    nonce: 0
  }
}
const nodes = []
// Create new nodes based on our identities, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(new Node(identities[i], genesis, network))
  network.connectPeer(nodes[i], 1)
}
network.broadcast(nodes[0].pid, 'Hello World')
network.run(100)

function visualizeNetwork (network) {
  // Press "Execute" to run your program
  var faker = require('faker')
  var Graph = require('p2p-graph')

  var graph = new Graph('.root')

  // select event
  graph.on('select', function (id) {
    console.log(id + ' selected!')
  })

  // Add main peer
  graph.add({
    id: 'me',
    me: true,
    name: 'You'
  })

  for (let i = 0; i < 10; i++) {
    // add peers
    graph.add({
      id: 'peer' + i,
      name: faker.internet.ip()
    })
    // connect them
    graph.connect('me', 'peer' + i)
  }
}
visualizeNetwork(network)
