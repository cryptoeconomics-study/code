const NetworkSimulator = require('./networksim');

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
const network = new NetworkSimulator((latency = 5), (packetLoss = 0));
for (const a of testAgents) {
  network.connectPeer(a, 1);
}
network.broadcast('karl', 'testing!');
network.broadcast('aparna', 'besting!');
console.log(network);
network.run(100);
