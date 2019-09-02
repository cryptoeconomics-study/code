const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('../../networkSim');
const { Node, getTxHash } = require('../../nodeAgent');
const Spender = require('../solutions/spenderNode');

// ////////////////////////////////////////////////////////
// ****** Test this out using a simulated network ****** //
// ////////////////////////////////////////////////////////

// you don't need to do anything here
// this will just create a network simulation with some nodes
// then simulate the nodes sending transactions and interacting on the network

// Initialize network simulation parameters
const numNodes = 5;
const numConnections = 2;
const wallets = [];
const genesis = {};
const network = new NetworkSimulator((latency = 5), (packetLoss = 0.1));
for (let i = 0; i < numNodes; i++) {
  wallets.push(EthCrypto.createIdentity());
  genesis[wallets[i].address] = {
    balance: 100,
    nonce: 0,
  };
}

// Create new Spender nodes based on our wallets, and connect them to the network
const nodes = [];
for (let i = 0; i < numNodes; i++) {
  nodes.push(
    new Spender(wallets[i], JSON.parse(JSON.stringify(genesis)), network, nodes),
  );
  network.connectPeer(nodes[i], numConnections);
}

// PROBLEM
// `nodes` is defined here, but the Spender class needs to know what nodes there are in order to connect to them. Originally this test was written in the same file as the Spender class, but now that they are separated this is broken.
// MOVING GET RANDOM RECEIVER FROM SPENDERNODE.JS
const getRandomReceiver = (address) => {
  // create array without this Node
  const otherNodes = nodes.filter(n => n.wallet.address !== address);
  const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)];
  return randomNode.wallet.address;
};
const tx = nodes[0].generateTx(getRandomReceiver(nodes[0].wallet.address), 10);
nodes[0].onReceive(tx);
// Broadcast this tx to the network
nodes[0].network.broadcast(nodes[0].pid, tx);

// Run the network simulation until a transaction fails
try {
  network.run((steps = 300));
} catch (e) {
  console.log(
    'One of our honest nodes had a transaction fail because of network latency!',
  );
  console.log('err:', e);
  for (let i = 0; i < numNodes; i++) {
    console.log('~~~~~~~~~~~ Node', i, '~~~~~~~~~~~');
    console.log(nodes[i].state);
  }
  console.log(nodes[1].invalidNonceTxs[wallets[0].address]);
}
