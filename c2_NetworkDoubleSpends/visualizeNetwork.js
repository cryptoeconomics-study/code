// This is an incomplete file, just to save how one might generate a network graph visualization

function visualizeNetwork (network) {
  // Press "Execute" to run your program
  var Graph = require('p2p-graph')

  var graph = new Graph('.root')

  // select event
  graph.on('select', function (id) {
    console.log(id + ' selected!')
  })

  for (let i = 0; i < nodes.length; i++) {
    // add peers
    graph.add({
      id: nodes[i].pid,
      name: nodes[i].pid.slice(0, 10)
    })
  }
  for (const node of nodes) {
    // connect them
    for (const peer of network.peers[node.pid]) {
      graph.connect(node.pid, peer.pid)
    }
  }
}

