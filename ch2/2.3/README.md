> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://cryptoeconomics.study/docs/en/sync/getting-started-development-setup).

> ! The chapter 2 coding challenges use a network simulation. This is created by nodeAgent.js, networkSim.js, and netTest.js in the `ch2` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch2` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

## Latency-Based Consensus

In order to implement latency based consensus we're going to need to extend our Node class. We will do this, then construct a few tests. In these tests we will try to attack the network, but our new nodes will prevent any damage. This will give you an appreciation for how these attacks work as well as the mechanisms that can help us prevent them.

<br />

## Fault Tolerant Node

In order to extend the vanilla node simulation with logic to handle fault tolerant consensus we will modify the `onReceive()` function.
```
// what the node does when it receives a transaction
onReceive(tx) {
	// TODO
	// if we're already seen (and processed the transaction), jut return since there's nothing to do
	// get the signature from the transaction
	// return and do not process the transaction if the first signee is not tx sender
	// take note that we've seen the transaction
	// check that each signee is actually a peer in the network
	// add to pending ( we'll apply this transaction once we hit finalTimeout)
	// choice rule: if the node has two transactions with same sender, nonce, and timestamp then apply the one with lower sig first
	// add this node's signature to the transaction
	// broadcast the transaction to the rest of the network so that another node can sign it
}
```

<br />

## Time Stamps

Time stamps are a crucial part of latency based consensus. In `timestampTest.js` we will extend `NetworkSimulator` to allow for timestamps. We will then create a few attacks to test out our fault tolerant nodes and make sure they are working correctly.
```
// TODO
// create two transactions with the same amount, but with different timestamps
// broadcast both transactions to the network at the same time
```

<br />

## Testing

To test our new fault tolerant nodes we will run `doubleSpendTest.js`, `faultTolerantTest.js`, and `timestampTest.js`. This will test that our fault tolerant node is functioning correctly, that it's blocking double spends, and that it's blocking timestamp attacks.

> As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)

