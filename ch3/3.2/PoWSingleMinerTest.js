var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')
var Miner = require('./PoWMiner')
var Client = require('./PoWClient')

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
const latency = 15 //10-15 ticks per message
const packetLoss = 0
const network = new NetworkSimulator(latency, packetLoss)
for (let i = 0; i < numNodes; i++) {
  wallets.push(EthCrypto.createIdentity())
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
for (let i = 0; i < numNodes-1; i++) {
  nodes.push(new Client(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  network.connectPeer(nodes[i], 3)
}
nodes.push(new Miner(wallets[numNodes-1], JSON.parse(JSON.stringify(genesis)), network))
network.connectPeer(nodes[numNodes-1], 3)

const tx0 = nodes[0].generateTx(nodes[1].wallet.address,10)
network.broadcast(nodes[0].pid, tx0)
console.log('sent tx0')
for (let i = 0; i < 800; i++) {
  network.tick()
}
const tx1 = nodes[0].generateTx(nodes[2].wallet.address, 5)
network.broadcast(nodes[0].pid, tx1)
console.log('sent tx1')
for (let i = 0; i < 800; i++) {
  network.tick()
}
const tx2 = nodes[0].generateTx(nodes[3].wallet.address, 6)
network.broadcast(nodes[0].pid, tx2)
console.log('sent tx2')
for (let i = 0; i < 800; i++) {
  network.tick()
}
const tx3 = nodes[1].generateTx(nodes[4].wallet.address, 3)
network.broadcast(nodes[1].pid, tx3)
console.log('sent tx3')
for (let i = 0; i < 1500; i++) {
  network.tick()
}


for (let i = 0; i < numNodes; i++) {
  console.log('node: ', nodes[i].p2pNodeId.address)
  // console.log('my chain',nodes[i].blockchain)
  // console.log('all blocks',nodes[i].allBlocks)
  console.log('chain len', nodes[i].blockchain.length)
  for (let j = 0; j < nodes[i].blockchain.length; j++) {
    console.log('block number', nodes[i].blockchain[j].number)
    console.log('block parentHash', nodes[i].blockchain[j].parentHash)
    console.log('txs:', nodes[i].blockchain[j].contents.txList)
  }
  console.log('node state: ', nodes[i].state)
  // console.log('invalidNonceTxs: ', nodes[i].invalidNonceTxs)
  console.log('xxxxxxxxx0xxxxxxxxx')
  // nodes[i].getState()
  // console.log('new node state: ', nodes[i].state)
}
