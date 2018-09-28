var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksim')
var {Node} = require('./nodeAgent')

class DoubleSpendNetSim extends NetworkSimulator {
  constructor (latency, packetLoss) {
    super(latency, packetLoss)
  }

  tick () {
    // call NetworkSimulator tick()
    super.tick()
    let victimBalances = []
    for (let v of victims) {
      victimBalances.push([v.state[evilNode.wallet.address].balance, v.state[v.wallet.address].balance])
      console.log('Victim ' + victimBalances.length + ' has balance ' + victimBalances[victimBalances.length - 1][1])
      if (Object.keys(v.invalidNonceTxs).length > 0) {
        console.log('Double spend propagated to victim ' + victimBalances.length)
      }
    }
    if (victimBalances[0][1] === 100 && victimBalances[1][1] === 100) {
      console.log('Double spend detected!!!!! Ahh!!!')
      throw (new Error('Double spend was successful!'))
    }
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const network = new DoubleSpendNetSim(latency = 5, packetLoss = 0.1);
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
  nodes.push(new Node(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  // Connect everyone to everyone
  network.connectPeer(nodes[i], numConnections = 3)
}

// Attempt double spend
const evilNode = nodes[0]
const victims = [network.peers[evilNode.pid][0], network.peers[evilNode.pid][1]]
const spends = [evilNode.generateTx(victims[0].wallet.address, amount = 100), evilNode.generateTx(victims[1].wallet.address, amount = 100)]
network.broadcastTo(evilNode.pid, victims[0], spends[0])
network.broadcastTo(evilNode.pid, victims[1], spends[1])

// Now run the network until an invalid spend is detected.
// We will also detect if the two victim nodes, for a short time, both believe they have been sent money
// by our evil node. That's our double spend!
network.run(steps = 20);

console.log('Looks like the double spend was foiled by network latency! Victim 1 propagated their transaction ' +
  'to Victim 2 before Victim 2 received the evil node\'s attempt to double spend (or vise-versa)!')
