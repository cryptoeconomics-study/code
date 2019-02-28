const NetworkSimulator = require('./networksim')
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
const network = new NetworkSimulator(latency = 5, packetLoss = 0);
for (let a of testAgents) {
  network.connectPeer(a, 1)
}
network.broadcast('karl', 'testing!')
network.broadcast('aparna', 'besting!')
console.log(network)
network.run(100)
