var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')
var {Node, getTxHash} = require('../nodeAgent')

// Spender is a Node that sends a random transaction at every tick()
class FaultTolerant extends Node {
  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
    this.delta = 10
  }

  timeout(timestamp, numObservers) {
    return timestamp + (numObservers - 0.5) * 2 * this.delta
  }
  addressesFromSigs(tx) {
      let addressSet = new Set()
      for (let i = 0; i < tx.sigs.length; i++) {
        const sig = tx.sigs[i]
        const slicedTx = {
          contents: tx.contents
          sigs: tx.sigs.slice[0,i]
        }
        const messageHash = EthCrypto.hash.keccak256(JSON.stringify(slicedTx))
        const address = EthCrypto.recover(sig, messageHash)
        addressSet.add(address)
      }
      return addressSet
  }
  onReceive (tx) {
    if (this.transactions.includes(tx.contents)) return
    const sigs = this.addressesFromSigs(tx)
    if(network.time >= timeout(tx.contents.timestamp, sigs.size)) return
    //TODO Check that each signee is actually a peer in the network
      //-possible attack: byzantine node signs a message 100 times with random Private Key



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
