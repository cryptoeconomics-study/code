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

  connectPeer (newPeer, numConnections) {
    newPeer.network = this
    const shuffledAgents = _.shuffle(this.agents)
    this.agents.push(newPeer)
    this.peers[newPeer.pid] = []
    for (let a of shuffledAgents.slice(0, numConnections)) {
      this.peers[newPeer.pid].push(a)
      this.peers[a.pid].push(newPeer)
    }
  }

  broadcast (sender, message) {
    for (let pid of this.peers[sender]) {
      const recvTime = this.time + this.latencyDistribution()
      if (!(recvTime in this.messageQueue)) {
        this.messageQueue[recvTime] = []
      }
      this.messageQueue[recvTime].push({recipient: pid, message})
    }
  }

  tick () {
    if (this.time in this.messageQueue) {
      for (let {recipient, message} of this.messageQueue[this.time]) {
        if (Math.random() > this.packetLoss) {
          recipient.onReceive(message)
        }
      }
      delete this.messageQueue.time
    }
    for (let a of this.agents) {
      a.tick()
    }
    this.time += 1
  }

  run (steps) {
    for (let i = 0; i < steps; i++) {
      this.tick()
    }
  }
}

const network = new NetworkSimulator(5, 0.1)
const testAgents = [
  {
    pid: 'karl',
    onReceive: function (message) { console.log(this.pid, 'got', message) },
    tick: function () {}
  },
  {
    pid: 'aparna',
    onReceive: function (message) { console.log(this.pid, 'got', message) },
    tick: function () {}
  },
  {
    pid: 'jing',
    onReceive: function (message) { console.log(this.pid, 'got', message) },
    tick: function () {}
  },
  {
    pid: 'bob',
    onReceive: function (message) { console.log(this.pid, 'got', message) },
    tick: function () {}
  },
  {
    pid: 'phil',
    onReceive: function (message) { console.log(this.pid, 'got', message) },
    tick: function () {}
  },
  {
    pid: 'vitalik',
    onReceive: function (message) { console.log(this.pid, 'got', message) },
    tick: function () {}
  }
]
for (let a of testAgents) {
  network.connectPeer(a, 1)
}
network.broadcast('karl', 'testing!')
network.broadcast('aparna', 'besting!')
console.log(network)
network.run(50)

module.exports = function (latency = 5, packetLoss = 0.1) {
  return new NetworkSimulator(latency, packetLoss)
}
