var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksimFT')
var FaultTolerant = require('./FaultTolerant')
var {getTxHash} = require('../nodeAgent')

class TimestampSimulator extends NetworkSimulator {
  constructor (latency, packetLoss) {
    super(latency, packetLoss)
  }

  tick () {
    // call NetworkSimulator tick()
    super.tick()

    if (this.time === 5) {
      network.broadcast(evilNode.pid, fakeEarlySpend)
    }
  }
}
// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const network = new TimestampSimulator(latency = 5, packetLoss = 0);
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
 const generateCustomTx = (to, amount, timestamp, node) =>{
    const unsignedTx = {
      type: 'send',
      amount: amount,
      from: node.wallet.address,
      to: to,
      nonce: node.state[node.wallet.address].nonce,
      timestamp: timestamp
    }
    const tx = {
      contents: unsignedTx,
      sigs: []
    }
    tx.sigs.push(EthCrypto.sign(node.wallet.privateKey, getTxHash(tx)))
    return tx
  }
// const spends = [evilNode.generateTx(victims[0].wallet.address, amount = 100), evilNode.generateTx(victims[1].wallet.address, amount = 100)]
const spend = generateCustomTx(victims[0].wallet.address, amount = 100, timestamp = 10, evilNode)
const fakeEarlySpend = generateCustomTx(victims[1].wallet.address, amount = 100, timestamp = 0, evilNode)
network.broadcast(evilNode.pid, spend)
// Now run the network until an invalid spend is detected.
// We will also detect if the two victim nodes, for a short time, both believe they have been sent money
// by our evil node. That's our double spend!
try {
  network.run(steps = 100)
} catch (e) {
  console.log('err:', e)
  for (let i = 0; i < numNodes; i++) {
    console.log('~~~~~~~~~~~ Node', i, '~~~~~~~~~~~')
    console.log(nodes[i].state)
  }
}
console.log('all nodes stayed in consensus!')
