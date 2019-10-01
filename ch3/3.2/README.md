> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://cryptoeconomics.study/docs/en/sync/getting-started-development-setup).

> ! The chapter 3 coding challenges use a network simulation. This is created by nodeAgent.js and networkSim.js in the `ch3` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch3` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

# Bitcoin and Nakamoto Consensus

In this coding challenge we're going to extend the work we did in 3.1 to create a proof of work miner node. While hashes and networking have existed for a long time, the core innovation of Bitcoin is that nodes are incentivized to do work to prove that they can submit new blocks. This aligns incentives for all parties on the network and ends up creating a public good even though they are behaving economically rationally. Because miners do the work to find "proofs of work," we know that anyone can't just modify the state arbitrarily. Because the network is public all the other miners can check every proof of work (and every tx in every block) to make sure it's legit. Miners are engaged in a competitive game and they don't want to give other miners extra rewards if they haven't earned them. Also, if they did and the public found out the value of the network would go to 0 so everyone is incentivized to work hard and to also to be honest otherwise they'll lose their rewards.

<br />

## Creating Blocks

The reason miners are rewarded for creating valid proofs of work is that we want them to produce valid blocks for the network. The `createBlock()` function will aggregate all the valid transactions we have into a block.
```
// Create a new block
createBlock() {
	// get all the transactions for this block
	// get the timestamp
	// create a new block
	// - nonce
	// - block number
	// - give ourselves the coinbase reward for finding the block
	// - log the difficulty of the network
	// - show the hash of the block that matches the network difficulty
	// - timestamp
	// - transactions
	// return the block
}
```

<br />

## Receiving and Processing Blocks

When we receive new blocks (or create them) we need to add them to our view of the state (blockchain). With `receiveBlock()` we will take in a block, check it, and if it's valid broadcast it to the rest of the network. Then we'll add it to our view of the blockchain and start mining on top of it to get another coinbase reward.
```
// What we do when we get a new block (from ourselves or the network)
receiveBlock(block) {
	// create a variable to hold the hash of the old block so that we can mine on top of it
	// use the receiveBlock() function from the client to check the block and broadcast it to to the network
	// update the head of the local state of our blockchain
	// if the block head has changed, mine on top of the new head
	// - start creating/mining a new block
}
```

<br />

## Mining

While the network wants miners to create new valid blocks, miners just want to get paid. As such, they are perpetually engaged in mining to find valid block hashes. `tick()` simulates that mining activity by trying to find a valid block hash on top of the most recent block.
```
// Start mining
tick() {
	// for every instance we try to mine (where hashRate determines the amount of computations a GPU or ASIC could process in parrallel)
	// - if we find a valid block
	// -- get the valid blockhash
	// -- log the results to the console
	// -- create the valid block
	// -- process the valid block
	// -- end the loop and keep mining
	// - if we did not find a block, incriment the nonce and try again
}
```

<br />

## Testing

To test our proof of work miner we're going to use the `PoWSingleMinerTest.js` and `PoWAllMinerTest.js` network simulation in the `solutions` folder. These tests will simulate a network of miners mining blocks and creating transactions for your PoWClient to process.

<br />

> As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)
