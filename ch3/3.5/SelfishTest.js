const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('../networksim');
const Miner = require('./PoWMiner');
const SelfishMiner = require('./SelfishMiner');

// ****** Test this out using a simulated network ****** //
const numNodes = 5;
const wallets = [];
const genesis = {};
const latency = 9; // 6-9 ticks per message
const packetLoss = 0;
const network = new NetworkSimulator(latency, packetLoss);
for (let i = 0; i < numNodes; i++) {
  wallets.push(EthCrypto.createIdentity());
  genesis[wallets[i].address] = {
    balance: 0,
    nonce: 0,
  };
}
// Give wallet 0 some money at genesis
genesis[wallets[0].address] = {
  balance: 100,
  nonce: 0,
};

const nodes = [];
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes - 1; i++) {
  nodes.push(
    new Miner(wallets[i], JSON.parse(JSON.stringify(genesis)), network),
  );
  network.connectPeer(nodes[i], 3);
}
// Add Selfish Miner
nodes.push(
  new SelfishMiner(
    wallets[numNodes - 1],
    JSON.parse(JSON.stringify(genesis)),
    network,
  ),
);
network.connectPeer(nodes[numNodes - 1], 3);

const tx0 = nodes[0].generateTx(nodes[1].wallet.address, 10);
nodes[0].network.broadcast(nodes[0].pid, tx0);
for (let i = 0; i < 2000; i++) {
  network.tick();
}
const tx1 = nodes[0].generateTx(nodes[2].wallet.address, 5);
nodes[0].network.broadcast(nodes[0].pid, tx1);
for (let i = 0; i < 2000; i++) {
  network.tick();
}
const tx2 = nodes[0].generateTx(nodes[3].wallet.address, 6);
nodes[0].network.broadcast(nodes[0].pid, tx2);
for (let i = 0; i < 2000; i++) {
  network.tick();
}
const tx3 = nodes[1].generateTx(nodes[4].wallet.address, 3);
nodes[1].network.broadcast(nodes[1].pid, tx3);
for (let i = 0; i < 10000; i++) {
  network.tick();
}

const selfishAddress = nodes[numNodes - 1].wallet.address;
console.log(selfishAddress);
let totalHashRate = 0;
for (let i = 0; i < numNodes; i++) {
  totalHashRate += nodes[i].hashRate;
  console.log('node: ', nodes[i].p2pNodeId.address);
  // console.log('my chain',nodes[i].blockchain)
  // console.log('all blocks',nodes[i].allBlocks)
  console.log('chain len', nodes[i].blockchain.length);
  // for (let j = 0; j < nodes[i].blockchain.length; j++) {
  // console.log('block number', nodes[i].blockchain[j].number)
  // console.log('block parentHash', nodes[i].blockchain[j].parentHash)
  // }
  console.log('node state: ', nodes[i].state);
  // console.log('invalidNonceTxs: ', nodes[i].invalidNonceTxs)
  console.log('xxxxxxxxx0xxxxxxxxx');
  // nodes[i].getState()
  // console.log('new node state: ', nodes[i].state)
}
const totalBlocks = nodes[0].blockchain.length;
let selfishBlocks = 0;
for (const block of nodes[0].blockchain) {
  if (block.coinbase === selfishAddress) {
    selfishBlocks++;
    console.log('Block', block.number, 'SELFISH');
  } else {
    console.log('Block', block.number, 'honest');
  }
}
console.log(
  'Selfish % Hash rate:',
  (100 * nodes[numNodes - 1].hashRate) / totalHashRate,
);
console.log('Selfish % Blocks mined:', (100 * selfishBlocks) / totalBlocks);
