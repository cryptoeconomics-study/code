> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).

<br />

Welcome to chapter 2!

The chapter 2 coding challenges use a network simulation. This is created by nodeAgent.js, networkSim.js, and netTest.js in the `ch2` directory. You do not need to understand how this network simulation works to complete the coding challenges in chapter 2, but we highly recommend it.

<br />

## Network Nodes

In the previous chapter users had a client that they used to connect to a centralized database controlled by "Paypal." In this chapter, every user is going to have their own database for the network including all the functions to create, check, and process transactions. This is called a node. When a user wants to send a transaction, rather than sending it to Paypal to be processed they broadcast it to the network. Then every other node on the network verifies the transaction, and if it follows the network's protocol (rules) then they add it to their state. This way every node has a view of the entire network without trusting or relying on a central operator.

Because every user runs a node on the network, users can verify the integrity of their transactions and be assured that no other nodes are cheating. If a node were to deviate from the network protocol then that node would not be recognized as legitimate. The legitimate state is the state that the majority of nodes (51%) agree to. This means, that in order to change the network protocol one would have to convince 51% of nodes to switch over.

The node's state:
```
// Initialize the node's state
constructor(wallet, genesis, network) {
	// create a public/private key pair and initialize an address for this node
	this.wallet = wallet;
	// P2P node identity -- used for connecting to peers
	this.p2pNodeId = EthCrypto.createIdentity();
	// peer identity
	this.pid = this.p2pNodeId.address;
	// the network we're on
	this.network = network;
	// our view of the state of the network
	this.state = genesis;
	// our list of processed valid transactions
	this.transactions = [];
	// our list of pending transactions that have invalid nonces
	this.invalidNonceTxs = {};
}
```

What the node does when it receives a transaction:
```
onReceive(tx) {
	// if we already have the transaction
	if (this.transactions.includes(tx)) {
		// return to exit the function
		return;
	}
	// add the transaction to the node's transactions array
	this.transactions.push(tx);
	// process the transaction
	this.applyTransaction(tx);
	// broadcast the transaction to the rest of the network so they can process it too
	this.network.broadcast(this.pid, tx);
	// check for other transactions that might be in the invalid nonce pool from the same sender
	// because once the first transaction was processed, maybe some new ones will be valid now
	this.applyInvalidNonceTxs(tx.contents.from);
}
```

How the node handles transactions it receives that have an invalid nonce:
```
// Protocol for dealing with received transactions that have an invalid nonce
applyInvalidNonceTxs(address) {
	// figure out what the current nonce is for that address
	const targetNonce = this.state[address].nonce;
	// if the invalid nonce pool has a transaction from the address that matches the current nonce
	if (
		address in this.invalidNonceTxs
		&& targetNonce in this.invalidNonceTxs[address]
	) {
		// process the transaction
		this.applyTransaction(this.invalidNonceTxs[address][targetNonce]);
		// delete the transaction from the invalid nonce pool
		delete this.invalidNonceTxs[address][targetNonce];
		// check for other transactions that might be in the invalid nonce pool from the same sender
		// because once the first transaction was processed, maybe some new ones will be valid now
		this.applyInvalidNonceTxs(address);
	}
}
```

How the node generates new transactions:
```
// Generates a Javascript object with an unsigned transaction and a signature of that unsigned transaction
generateTx(to, amount) {
	// create an unsigned transaction object
	const unsignedTx = {
		// type of transaction
		type: 'send',
		// amount of transaction
		amount,
		// which address the transaction is from
		from: this.wallet.address,
		// which address the transaction is going to
		to,
		// the nonce of the sender's address at the time of creating this transaction
		nonce: this.state[this.wallet.address].nonce,
	};
	// create a transaction object
	const tx = {
		// unsigned transaction
		contents: unsignedTx,
		// signature of the unsigned transaction
		// (hash the unsigned transaction object and then sign it with this node's private key)
		sig: EthCrypto.sign(this.wallet.privateKey, getTxHash(unsignedTx)),
	};
	// return the transaction object
	return tx;
}
```

How the node processes transactions with a valid nonce:
```
// This is a simplified version of the protocol that Paypal used in chapter 1
// This time, every node in the network performs their own verification of transaction on the network vs just being a client that receives data from a server
applyTransaction(tx) {
	// Check that the from address matches the signature in the transaction
	const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents));
	if (signer !== tx.contents.from) {
		throw new Error('Invalid signature!');
	}
	// If we don't have a record for this address, create one
	if (!(tx.contents.to in this.state)) {
		this.state[[tx.contents.to]] = {
			balance: 0,
			nonce: 0,
		};
	}
	// Check that the nonce is correct for replay protection
	if (tx.contents.nonce !== this.state[[tx.contents.from]].nonce) {
		// If it isn't correct, then we should add the transaction to invalidNonceTxs
		if (!(tx.contents.from in this.invalidNonceTxs)) {
			this.invalidNonceTxs[tx.contents.from] = {};
		}
		this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx;
		return;
	}
	if (tx.contents.type === 'send') {
		// Send coins
		if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
			throw new Error('Not enough money!');
		}
		this.state[[tx.contents.from]].balance -= tx.contents.amount;
		this.state[[tx.contents.to]].balance += tx.contents.amount;
	} else {
		throw new Error('Invalid transaction type!');
	}
	// increment the nonce of the sender of the transaction in our state
	this.state[[tx.contents.from]].nonce += 1;
}
```

<br />

## Network Simulation

Now that we have a node setup for our users, we need to setup a network for them to connect to. `networkSim.js` simulates many of characteristics of a real network, including latency. This allows nodes to connect to the network, sync to the latest state, send and receive transactions.

While this "network" is only running locally on your machine, your computer will create separate programs each with their own state and make them interact. Let's look at how our simplified network simulation works.

> Note: To actually connect decentralized nodes across the world a lot more would be required, esp networking.

The global network parameters
```
// initialize the network parameters
constructor(latency, packetLoss) {
	const normalRandom = d3.randomNormal.source(seedrandom('a22ebc7c488a3a47'))(
		latency,
		(latency * 2) / 5,
	);
	this.agents = [];
	this.latencyDistribution = () => Math.floor(Math.max(normalRandom(), 0));
	this.time = 0;
	this.messageQueue = {};
	this.peers = {};
	this.packetLoss = packetLoss;
}
```

How nodes sync their state to the state of the network when they connect
```
// connect new peers (Nodes) to the network
connectPeer(newPeer, numConnections) {
	newPeer.network = this;
	const shuffledAgents = _.shuffle(this.agents);
	this.agents.push(newPeer);
	this.peers[newPeer.pid] = [];
	for (const a of shuffledAgents.slice(0, numConnections)) {
		this.peers[newPeer.pid].push(a);
		this.peers[a.pid].push(newPeer);
	}
}
```

How nodes broadcast messages from a node to the rest of the network
```
broadcast(sender, message) {
	for (const pid of this.peers[sender]) {
		this.broadcastTo(sender, pid, message);
	}
}

```

How nodes broadcast a message from one node to another node
```
broadcastTo(sender, receiver, message) {
	const recvTime = this.time + this.latencyDistribution();
	if (!(recvTime in this.messageQueue)) {
		this.messageQueue[recvTime] = [];
	}
	this.messageQueue[recvTime].push({ recipient: receiver, message });
}
```


How nodes simulate message broadcasting (transactions) on the network and introduce random latency
```
tick() {
	if (this.time in this.messageQueue) {
		for (const { recipient, message } of this.messageQueue[this.time]) {
			if (Math.random() > this.packetLoss) {
				recipient.onReceive(message);
			}
		}
		delete this.messageQueue[this.time];
	}
	for (const a of this.agents) {
		a.tick();
	}
	this.time += 1;
}

```

How many steps (iterations) to run the network simulation with latency
```
run(steps) {
	for (let i = 0; i < steps; i++) {
		this.tick();
	}
}
```

<br />

## Testing the Network Simulation

Now that we have our nodes and network setup, we need to test them out! `netTest.js` allows you to create some nodes, connect them to the network, and simulate broadcasting some messages.

Create some agents who will log a message to the console when they receive a message
```
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

```

Initialize the network, create nodes for the agents, connect those nodes to the network, and simulate some message passing (broadcasting)
```
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
```

If you want to test out the network simulation navigate to the `ch2` directory and run `node networkSim.js` from the terminal. In the rest of the chapter we'll add more functionality to our test network, but for now just make sure that the basics are working! :)

> If you're having trouble getting the network simulation working [make sure you have your development environment setup correctly](getting-started/development-environment).

<br />



