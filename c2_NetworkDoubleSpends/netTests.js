var topology = [
  {src: 'node1', dst: 'node2'},
  {src: 'node2', dst: 'node3', packetLoss: 0.5},
  {src: 'node3', dst: 'node4', latencyMean: 100, latencySigma: 7},
  {src: 'node1', dst: 'node4', packetLoss: 0.4, latencyMean: 100, latencySigma: 0}
]

var NetSim = require('netsim')
var netsim = new NetSim(topology)

netsim.addNode({uuid: 'node1',
  onStart: function () {
    this.sendMessage('node4', 'Marco!')
  },
  onMessageReceived: function (id, msg) {
    console.log(this.uuid + ' received msg: ' + msg)
  } })

netsim.addNode({uuid: 'node4',
  onMessageReceived: function (id, msg) {
    console.log(this.uuid + ' received msg: ' + msg)
    this.sendMessage('node1', 'Polo!')
  } })

netsim.simulate()
