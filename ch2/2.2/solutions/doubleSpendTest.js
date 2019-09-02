const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('../../networkSim');
const { Node } = require('../../nodeAgent');

// Double Spending Network Simulation
// this extends the NetworkSimulator class by logging important information related to double spending
class DoubleSpendNetSim extends NetworkSimulator {
  // initialize initial parameters
  constructor(latency, packetLoss) {
    super(latency, packetLoss);
  }

  // do stuff and log the results
  tick() {
    // call NetworkSimulator tick()
    super.tick();
    const victimBalances = [];
    // for all the victims (network participants)
    for (const v of victims) {
      victimBalances.push([
        v.state[evilNode.wallet.address].balance,
        v.state[v.wallet.address].balance,
      ]);
      // keep track of the balances of network participants
      console.log(
        `Victim ${victimBalances.length} has balance ${
          victimBalances[victimBalances.length - 1][1]
        }`,
      );
      // if a successful double spend is detected (nodes accepted both transactions to the victims), then stop the simulation and log the results to the console
      if (Object.keys(v.invalidNonceTxs).length > 0) {
        console.log(
          `Double spend propagated to victim ${victimBalances.length}`,
        );
      }
    }
    if (victimBalances[0][1] === 100 && victimBalances[1][1] === 100) {
      console.log('Double spend detected!!!!! Ahh!!!');
      throw new Error('Double spend was successful!');
    }
  }
}

// ////////////////////////////////////////////////////////
// ****** Test this out using a simulated network ****** //
// ////////////////////////////////////////////////////////

// Initialize network parameters
const numNodes = 5;
const wallets = [];
const genesis = {};
const network = new DoubleSpendNetSim((latency = 5), (packetLoss = 0.1));

// Create some wallets representing users on the network
for (let i = 0; i < numNodes; i++) {
  // create new identity
  wallets.push(EthCrypto.createIdentity());
  // add that node to our genesis block & give them an allocation
  genesis[wallets[i].address] = {
    balance: 0,
    nonce: 0,
  };
}

// Give wallet 0 (the double spending node) some money at genesis
genesis[wallets[0].address] = {
  balance: 100,
  nonce: 0,
};

// Create new nodes based on our wallets, and connect them to the network
const nodes = [];
for (let i = 0; i < numNodes; i++) {
  nodes.push(
    new Node(wallets[i], JSON.parse(JSON.stringify(genesis)), network),
  );
  // connect everyone to everyone
  network.connectPeer(nodes[i], (numConnections = 3));
}

// Attempting to double spend!
// designate the node that will double spend
const evilNode = nodes[0];
// designate the nodes that we will perform the attack on
const victims = [
  network.peers[evilNode.pid][0],
  network.peers[evilNode.pid][1],
];
// create 2 identical transactions that have different recipients
const spends = [
  evilNode.generateTx(victims[0].wallet.address, (amount = 100)),
  evilNode.generateTx(victims[1].wallet.address, (amount = 100)),
];
// broadcast both transaction to the network at the same time
network.broadcastTo(evilNode.pid, victims[0], spends[0]);
network.broadcastTo(evilNode.pid, victims[1], spends[1]);

// Running the simulation
// due to network latency some nodes will receive one transaction before the other
// let's run the network until an invalid spend is detected
// we will also detect if the two victim nodes, for a short time, both believe they have been sent money by our evil node. That's our double spend!
network.run((steps = 20));

// If the network was able to run without an error, that means that the double spend was not successful
console.log(
  'Looks like the double spend was foiled by network latency! Victim 1 propagated their transaction '
    + "to Victim 2 before Victim 2 received the evil node's attempt to double spend (or vise-versa)!",
);
