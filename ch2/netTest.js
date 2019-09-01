const NetworkSimulator = require('./networkSim');

// netTest.js creates testing agents using the Node class from nodeAgent.js
// then connects those agents to a network simulation created by networkSim.js

// Some testing agents (users) for our network simulation
const testAgents = [
  {
    pid: 'karl',
    onReceive(message) {
      console.log(this.pid, 'got', message);
    },
    tick() {},
  },
  {
    pid: 'aparna',
    onReceive(message) {
      console.log(this.pid, 'got', message);
    },
    tick() {},
  },
  {
    pid: 'jing',
    onReceive(message) {
      console.log(this.pid, 'got', message);
    },
    tick() {},
  },
  {
    pid: 'bob',
    onReceive(message) {
      console.log(this.pid, 'got', message);
    },
    tick() {},
  },
  {
    pid: 'phil',
    onReceive(message) {
      console.log(this.pid, 'got', message);
    },
    tick() {},
  },
  {
    pid: 'vitalik',
    onReceive(message) {
      console.log(this.pid, 'got', message);
    },
    tick() {},
  },
];

// Network testing parameters
// initialize the network
const network = new NetworkSimulator((latency = 5), (packetLoss = 0));
// connect the testing agents to the network
for (const a of testAgents) {
  network.connectPeer(a, 1);
}
// test a broadcast to make sure the agents are connected
network.broadcast('karl', 'testing!');
network.broadcast('aparna', 'testing!');
// log the state of the network test to the console
console.log(network);
// run the network
network.run(100);
