> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://cryptoeconomics.study/docs/en/sync/getting-started-development-setup).

> ! The chapter 3 coding challenges use a network simulation. This is created by nodeAgent.js and networkSim.js in the `ch3` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch3` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

# Decentralized Consensus and Blockchains
- Let's explore the fundamentals of decentralized consensus and the blockchain data structure

<br />

In this chapter we're going to explore many of the core functions that a Proof of Work blockchain client would need. You'll build them out and then test them with a network simulation.

<br />

## Receiving Messages

Our blockchain clients will be able to receive both transactions and blocks. It's important that we can distinguish between the two! The `onReceive()` function receives a message and determines if it is a transaction or a block.

```
// Check if a message is a transaction or a block
onReceive(message) {
	// check the message.contents.type
	// - if it's 'send' it's a transaction and we need to use receiveTx(message) to process it
	// - if it's 'block' it's a block and we need to use receiveBlock(message) to process it
	}
}
```

<br />

## Processing Transactions

When we receive incoming transactions we want to first check that they're not a duplicate of a transaction we already have, then add it to the pending transaction pool, and then broadcast it to the rest of the network so that all the nodes can also process it. This way, whenever a block is mined all the most recent transactions will be included. This is altruistic behavior.
- Full clients on a network process all transactions and rebroadcast the valid ones.
- Light clients only receive the latest valid block, but do not process transactions themselves
		Most dApps and wallets are light clients because it would be a terrible user experience to wait for your phone or browser to sync up and process the entire blockchain whenever you wanted to check your balance. While this improves adoption, it also decreases decentralization and less and less people actually run full clients. More full clients, more decentralization. Less full clients, less decentralization.

This is a problem because there is no cryptoeconomic incentive to run a full client unless you're a miner and need to verify all the transactions on the network. As the size of a blockchain's history goes up it becomes more and more expensive to run a full client. At first everyone could do it. Then just people with extra storage on their laptops. Then just people with a dedicated computer to do it. Then just miners with specialized rigs to do it. Since miners often group together in mining pools, this is a problem. A cryptoeconomically strong solution to this problem is TBD.
```
// Process an incoming transaction
receiveTx(tx) {
	// if we already have the transaction in our state, return to do nothing
	// add the transaction to the pending transaction pool (this is often called the mempool)
	// broadcast the transaction to the res of the network
}
```

<br />

## Processing Blocks

When we receive new blocks we want to check that they're legit. This is important and everyone does it because we don't want to have an invalid state and accidentally fork off of the network.

### Checking the block hash

The first thing we do (after double checking that we haven't already seen this block) is to check the block hash. The block hash *is* the proof of work. It is literally proof that the miner spent the computational power to find a block hash that satisfies the network difficulty. While finding this hash is hard, checking it is as easy as counting the zeros in it. This will let us know if the block we're being sent actually has the proof of work, or if it's invalid.
```
// Check the hash of an incoming block
isValidBlockHash(block) {
	// hash the block
	// convert the hex string to binary
	// check how many leading zeros the hash has
	// compare the amount of leading zeros in the block hash to the network difficulty and return a boolean if they match (this is the proof of the work that the miner did to find a valid blockhash for this block)
}
```

### Processing the transactions in a block

Once we've checked that a block is valid, we then want to update our view of the state by processing the transactions in the block. This will give us the same view of the state of the network as every other client that has processed this block.
```
// Processing the transactions in a block
applyBlock(block) {
	// get all the transactions in block.contents
	// for every transaction in the transaction list
		// process the transaction to update our view of the state
		// if the transaction does not come from the 0 address (which is a mint transaction for miners and has no sender)
			// check any pending transactions with invalid nonces to see if they are now valid
}
```

### Updating the state
When we update the state we want to make sure that we only do so with transactions which are contained in the longest chain on the network. We will then return the resulting state object so that we can broadcast it to the network. This process is often referred to as the "fork choice" rule, the process of choosing the longest fork to build on the correct chain.
```
// Update the state with transactions which are contained in the longest chain and return the resulting state object (this process is often referred to as the "fork choice" rule)
updateState() {
	// create an array to represent a temp chain
	// create a variable to represent all the blocks that we have already processed
	// find the highest block number in all the blocks
	// add the highestBlockNumber to tempChain using blockNumber
	// add max number of blocks to tempChain using parentHash
	// save the ordered sequence
	// apply all txs from ordered list of blocks
	// return the new state
}
```

### Receiving and processing the block

The functions we just created perform various functions needed to process an incoming block. Now we're going to put them all together into a single function that processes incoming blocks.
```
// Receiving a block, making sure it's valid, and then processing it
receiveBlock(block) {
	// if we've already seen the block return to do nothing
	// if the blockhash is not valid return to do nothing
	// if checks pass, add block to all blocks received
	// if the block builds directly on the current head of the chain, append to chain
		// incriment the block number
		// add the block to our view of the blockchain
		// process the block
		// update our state with the new block
	// broadcast the block to the network
}
```

<br />

## Testing

To test your PoWClient, go into the `test` folder and run `node PoWAllMinerTest.js` or `node PoWSingleMinerTest.js`. These tests will simulate a network of miners mining blocks and creating transactions for your PoWClient to process.

<br />

> As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)