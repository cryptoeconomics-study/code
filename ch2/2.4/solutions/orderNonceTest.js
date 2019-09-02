const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('./networkSimPoA');
const Authority = require('./Authority');
const { getTxHash } = require('../../nodeAgent');
const PoAClient = require('./PoAClient');

// ****** Test this out using a simulated network ****** //
const numNodes = 5;
const wallets = [];
const genesis = {};
const network = new NetworkSimulator((latency = 5), (packetLoss = 0));
for (let i = 0; i < numNodes + 1; i++) {
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
const authority = new Authority(
  wallets[numNodes],
  JSON.parse(JSON.stringify(genesis)),
  network,
);
for (let i = 0; i < numNodes; i++) {
  nodes.push(
    new PoAClient(
      wallets[i],
      JSON.parse(JSON.stringify(genesis)),
      network,
      authority.wallet.address,
    ),
  );
  network.connectPeer(nodes[i], (numConnections = 2));
}
nodes.push(authority);
network.connectPeer(authority, (numConnections = 0));
for (let i = 0; i < network.agents.length; i++) {
  network.peers[authority.pid].push(network.agents[i]);
}

const getRandomReceiver = (address) => {
  // create array without this Node
  const otherNodes = nodes.filter(n => n.wallet.address !== address);
  const randomNode = otherNodes[Math.floor(Math.random() * otherNodes.length)];
  return randomNode.wallet.address;
};

const generateCustomTx = (to, amount, nonce, node) => {
  const unsignedTx = {
    type: 'send',
    amount,
    from: node.wallet.address,
    to,
    nonce,
  };
  const tx = {
    contents: unsignedTx,
    sigs: [],
  };
  tx.sigs.push(EthCrypto.sign(node.wallet.privateKey, getTxHash(tx)));
  return tx;
};

// Send 10 random txs
// These will be ordered by nonce by Authority node, but will be received out of order by the PoAClients
// This test checks that PoAClients reorder transactions correctly
for (let i = 0; i < 10; i++) {
  const tx = generateCustomTx(
    getRandomReceiver(nodes[0].wallet.address),
    10,
    i,
    nodes[0],
  );
  nodes[0].network.broadcastTo(nodes[0].pid, authority, tx);
}

// Run the network simulation to test order nonce functionality
try {
  network.run((steps = 100));
} catch (e) {
  console.log(e);
  for (let i = 0; i < numNodes; i++) {
    console.log('~~~~~~~~~~~ Node', i, '~~~~~~~~~~~');
    console.log(nodes[i].state);
  }
}
