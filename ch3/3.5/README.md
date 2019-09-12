> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).

> ! The chapter 3 coding challenges use a network simulation. This is created by nodeAgent.js and networkSim.js in the `ch3` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch3` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

# Selfish Mining

Selfish mining is a strategy miners can use to iteratively take a larger share of the mining rewards than their peers. This strategy has a griefing factor that hurts the miner in the short therm though, so we haven't seen this in practice yet. Non the less, it's a very real strategy and we'll reconstruct it here to see how it works. To do this we're going to extend our Miner class from 3.2 so that they can keep a private fork of the blockchain to mine on.

> Note: this attack is not possible in Proof of Stake systems as validators are chosen randomly and there is no way to be "ahead" of the main chain.

<br />

## Mining

The mining function is the same as before, but now we're going to keep track of a private fork and push all of our valid blocks there. The goal being to have a private chain that is longer than the public chain. We build up our private chain and wait for other miners expend resources building blocks. When they have a valid block we broadcast our longer chain to make the network throw their work away. This way we get all the rewards and they lost money mining an invalid block. This sometimes works, but sometimes it results on us mining on a fork that falls behind that we have to discard.
```
// Mining
tick() {
	for (let i = 0; i < this.hashRate; i++) {
		if (this.isValidBlockHash(this.blockAttempt)) {
			const blockHash = getTxHash(this.blockAttempt);
			console.log(
				this.pid.substring(0, 6),
				'found a private block:',
				blockHash.substring(0, 10),
				'at height',
				this.blockAttempt.number,
			);
			const validBlock = this.blockAttempt;
			// record height of the miner's private fork
			// add our latest valid block to our fork
			// start creating a new block and then return to exit the loop
		}
		this.blockAttempt.nonce++;
	}
}
```

<br />

## Receiving Blocks

When we receive blocks we still update our view of the chain, but then we need to compare that new state to our private chain. If we have an advantage we capitalize on that by broadcasting out private chain, otherwise we just keep mining.
```
// Receiving blocks
receiveBlock(block) {
	const { parentHash } = this.blockAttempt;
	super.receiveBlock(block);
	const newHead = this.blockchain.slice(-1)[0];
	// if the block head has changed due to a new block coming in, mine on top of the new head
	// then check to see if the other miners have caught up
	// - our new block extends our private chain start mining a new block
	// - public Fork has length 1 and private Fork has length 1, so broadcast
	// -  public Fork has length 3 and private fork has just reached length 2, so broadcast
	// - public blockchain has grown longer than private fork. Discard private fork and start mining on the public chain (longest chain)
}
```

<br />

## Broadcasting Our Private Fork

When we're ready to capitalize upon our work, we broadcast our private chain to the network.
```
// Broadcasting our private fork
broadcastPrivateFork() {
	// log the private fork to the console
	// resize our view of the blockchain to add the length of our private fork
	// broadcast all the blocks on our private fork to the network
		// - add the private block to our view of the blockchain
		// - add the private block to our list of all the blocks
		// - broadcast the private block to the network
	// update block number
	// reset private fork
	// start mining a new block
}
```

<br />

## Testing

To test our proof of work miner we're going to use the `SelfishTest.js` network simulation in the `solutions` folder. This test will simulate a network of miners mining blocks and creating transactions for your Selfish PoWClient to process.

<br />

> As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)
