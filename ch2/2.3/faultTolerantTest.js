const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('./networkSimFaultTolerant');
const FaultTolerant = require('./faultTolerant');

// ****** Test this out using a simulated network ****** //
const numNodes = 5;
const wallets = [];
const genesis = {};
const network = new NetworkSimulator((latency = 5), (packetLoss = 0));
for (let i = 0; i < numNodes; i++) {
  // Create new identity
  wallets.push(EthCrypto.createIdentity());
  // Add that node to our genesis block & give them an allocation
  genesis[wallets[i].address] = {
    balance: 100,
    nonce: 0,
  };
}
const nodes = [];
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(
    new FaultTolerant(
      wallets[i],
      JSON.parse(JSON.stringify(genesis)),
      network,
      (delta = 5),
    ),
  );
  network.connectPeer(nodes[i], (numConnections = 2));
}

// Create a quick test
// randomly choose a node in the network
const getRandomReceiver = (address) => {
  // create array without this Node
  const otherNodes = nodes.filter(n => n.wallet.address !== address);
  const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)];
  return randomNode.wallet.address;
};
// create a transaction to a random node in the network
const tx = nodes[0].generateTx(getRandomReceiver(nodes[0].wallet.address), 10);
nodes[0].onReceive(tx);
// Broadcast this tx to the network
nodes[0].network.broadcast(nodes[0].pid, tx);

// Run the network simulation test
try {
  network.run((steps = 80));
} catch (e) {
  console.err(e);
  for (let i = 0; i < numNodes; i++) {
    console.log('~~~~~~~~~~~ Node', i, '~~~~~~~~~~~');
    console.log(nodes[i].state);
  }
}
// success message
console.log('all nodes stayed in consensus!');
