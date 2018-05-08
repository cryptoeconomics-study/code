const _ = require('lodash')
const d3 = require('d3-random')
const seedrandom = require('seedrandom')

class NetworkSimulator {
  constructor (latency, packetLoss) {
    const normalRandom = d3.randomNormal.source(seedrandom('a22ebc7c488a3a47'))(latency, (latency * 2) / 5)
    this.agents = []
    this.latencyDistribution = () => Math.floor(Math.max(normalRandom(), 0))
    this.time = 0
    this.messageQueue = {}
    this.peers = {}
    this.packetLoss = packetLoss
  }

  connectPeer ({agents, peers}, newPeer, numConnections) {
    const shuffledAgents = _.shuffle(agents)
    agents.push(newPeer)
    peers[newPeer.id] = []
    for (let a of shuffledAgents.slice(0, numConnections)) {
      peers[newPeer.id].push(a.id)
      peers[a.id].push(newPeer.id)
    }
  }
}

const broadcast = (network, sender, message) => {
  for (let pid of network.peers[sender]) {
    const recvTime = network.time + network.latencyDistribution()
    if (!(recvTime in network.messageQueue)) {
      network.messageQueue[recvTime] = []
    }
    network.messageQueue[recvTime].push({recipient: pid, message})
  }
}

const tick = (network) => {
  if (network.time in network.messageQueue) {
    for (let {recipient, message} of network.messageQueue[network.time]) {
      console.log('woot', recipient, message)
    }
  }
  network.time += 1
}

function getNetwork (latency) {
  let network = {
    agents: [],
    latencyDistribution: () => Math.floor(Math.max(normalRandom(), 0)),
    time: 0,
    messageQueue: {},
    peers: {},
    reliability: 0.9,
    connectPeer: connectPeer.bind(null, this)
  }
  return network
}

const network = getNetwork(5)
const testAgents = [{id: 'karl'}, {id: 'aparna'}, {id: 'jing'}, {id: 'bob'}, {id: 'phil'}, {id: 'vitalik'}]
for (let a of testAgents) {
  network.connectPeer(a, 1)
}
console.log(network)

// console.log(network)
// for (let a of testAgents) {
//   connectPeer(network, a, 1)
// }
// broadcast(network, 'karl', 'testing!')
// broadcast(network, 'aparna', 'besting!')
// console.log(network)
// tick(network)
// tick(network)
// tick(network)
// tick(network)
// tick(network)
