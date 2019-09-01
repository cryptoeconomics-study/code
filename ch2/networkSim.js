const _ = require('lodash');
const d3 = require('d3-random');
const seedrandom = require('seedrandom');

// Create a network simulation
class NetworkSimulator {
  // the global network parameters
  constructor(latency, packetLoss) {
    const normalRandom = d3.randomNormal.source(seedrandom('a22ebc7c488a3a47'))(
      latency,
      (latency * 2) / 5,
    );
    this.agents = [];
    this.latencyDistribution = () => Math.floor(Math.max(normalRandom(), 0));
    this.time = 0;
    this.messageQueue = {};
    this.peers = {};
    this.packetLoss = packetLoss;
  }

  // connect new peers (Nodes) to the network
  connectPeer(newPeer, numConnections) {
    newPeer.network = this;
    const shuffledAgents = _.shuffle(this.agents);
    this.agents.push(newPeer);
    this.peers[newPeer.pid] = [];
    for (const a of shuffledAgents.slice(0, numConnections)) {
      this.peers[newPeer.pid].push(a);
      this.peers[a.pid].push(newPeer);
    }
  }

  // broadcast messages from a node to the rest of the network
  broadcast(sender, message) {
    for (const pid of this.peers[sender]) {
      this.broadcastTo(sender, pid, message);
    }
  }

  // broadcast a message from one node to another node
  broadcastTo(sender, receiver, message) {
    const recvTime = this.time + this.latencyDistribution();
    if (!(recvTime in this.messageQueue)) {
      this.messageQueue[recvTime] = [];
    }
    this.messageQueue[recvTime].push({ recipient: receiver, message });
  }

  // simulate message broadcasting (transactions) on the network and introduce random latency
  tick() {
    if (this.time in this.messageQueue) {
      for (const { recipient, message } of this.messageQueue[this.time]) {
        if (Math.random() > this.packetLoss) {
          recipient.onReceive(message);
        }
      }
      delete this.messageQueue[this.time];
    }
    for (const a of this.agents) {
      a.tick();
    }
    this.time += 1;
  }

  // how many steps (iterations) to run the network simulation with latency
  run(steps) {
    for (let i = 0; i < steps; i++) {
      this.tick();
    }
  }
}

module.exports = NetworkSimulator;
