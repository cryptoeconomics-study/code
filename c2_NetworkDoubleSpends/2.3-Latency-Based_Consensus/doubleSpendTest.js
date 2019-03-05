var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksimFT')
var FaultTolerant = require('./FaultTolerant')
var {getTxHash} = require('../nodeAgent')

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const network = new NetworkSimulator(latency = 5, packetLoss = 0);
for (let i = 0; i < numNodes; i++) {
  // Create new identity
  wallets.push(EthCrypto.createIdentity())
  // Add that node to our genesis block & give them an allocation
  genesis[wallets[i].address] = {
    balance: 0,
    nonce: 0
  }
}
// Give wallet 0 some money at genesis
genesis[wallets[0].address] = {
  balance: 100,
  nonce: 0
}
const nodes = []
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(new FaultTolerant(wallets[i], JSON.parse(JSON.stringify(genesis)), network, delta = 7))
  // Connect everyone to everyone
  network.connectPeer(nodes[i], numConnections = 3)
}

// Attempt double spend
const evilNode = nodes[0]
const victims = [network.peers[evilNode.pid][0], network.peers[evilNode.pid][1]]
const spends = [evilNode.generateTx(victims[0].wallet.address, amount = 100), evilNode.generateTx(victims[1].wallet.address, amount = 100)]
console.log('transactions:', spends)
network.broadcastTo(evilNode.pid, victims[0], spends[0])
network.broadcastTo(evilNode.pid, victims[1], spends[1])
// Now run the network until an invalid spend is detected.
// We will also detect if the two victim nodes, for a short time, both believe they have been sent money
// by our evil node. That's our double spend!
try {
  network.run(steps = 70)
} catch (e) {
  console.err(e)
  for (let i = 0; i < numNodes; i++) {
    console.log('~~~~~~~~~~~ Node', i, '~~~~~~~~~~~')
    console.log(nodes[i].state)
  }
}
console.log('all nodes stayed in consensus!')
