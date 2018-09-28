var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksim')
var {Node, getTxHash} = require('./nodeAgent')

// Spender is a Node that sends a random transaction at every tick()
class Spender extends Node {
  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
  }

  // returns a random wallet address (excluding the Spender)
  getRandomReceiver () {
    const that = this
    // create array without this Node
    const otherNodes = nodes.filter(function (n) {
      return n.wallet.address !== that.wallet.address
    });
    const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)]
    return randomNode.wallet.address
  }

  tick () {
    // If we have no money, don't do anything!
    if (this.state[this.wallet.address].balance < 10) {
      console.log('We are honest so we wont send anything :)')
      return
    }
    // Generate random transaction
    const tx = this.generateTx(this.getRandomReceiver(), 10)
    this.transactions.push(tx)
    this.applyTransaction(tx)
    // Broadcast this tx to the network
    this.network.broadcast(this.pid, tx)
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const network = new NetworkSimulator(latency = 5, packetLoss = 0.1);
for (let i = 0; i < numNodes; i++) {
  // Create new identity
  wallets.push(EthCrypto.createIdentity())
  // Add that node to our genesis block & give them an allocation
  genesis[wallets[i].address] = {
    balance: 100,
    nonce: 0
  }
}
const nodes = []
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(new Spender(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  network.connectPeer(nodes[i], numConnections = 2)
}

try {
  network.run(steps = 300)
} catch (e) {
  console.log('One of our honest nodes had a transaction fail because of network latency!')
  console.log('err:', e)
  for (let i = 0; i < numNodes; i++) {
    console.log('~~~~~~~~~~~ Node', i, '~~~~~~~~~~~')
    console.log(nodes[i].state)
  }
  console.log(nodes[1].invalidNonceTxs[wallets[0].address])
}
