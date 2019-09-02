> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).

> ! The chapter 2 coding challenges use a network simulation. This is created by nodeAgent.js, networkSim.js, and netTest.js in the `ch2` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch2` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

## Proof of Authority

Proof of Authority networks are a hybrid between completely open public blockchains and completely private blockchains. This is possible thanks to permissioning. Anyone can participate in the network, but only certain nodes have the permission (authority) to process transactions and create state transitions (new blocks). This allows participants to verify that everything is working correctly, while also allowing for faster transaction processing because we just trust the validators rather than making them perform a complex algorithm to earn the right to be the next validator.

<br />

## Authority Client

`Authority.js` extends the Node class to create a node that has the authority to, verify, order, and sign transactions as valid.
```
// TODO
// Order transactions and broadcast that ordering to the network
orderAndBroadcast(tx) {
	// give the transactiona the latest nonce in the Authority node's state
	// increment the nonce
	// sign the transaction to give it "proof of authority"
	// add the signed transaction to the history
	// broadcast the transaction to the network
}
```

<br />

## PoA Client

`PoAClient.js` extends the Node class to create nodes that can participate in the Proof of Authority network. This means that PoA client nodes can send, receive, and verify transactions, but cannot order and then sign them as "verified" because they don't have the authority.
```
// TODO
applyTransaction(tx) {
	// get the transaction from before the authority node added ordering and make a copy of it
	// delete the order nonce from the original transaction
	// clear the transaction signatures
	// get tx from before the auth node signed it
	// check the signer of the transaction and throw an error if the signature cannot be verified
	// check the autority for the network and throw an error if the transaction does not
	// Check that this is the next transaction in the Authority node's ordering
	// - hint: check if the nonce ordering is greater or less than it's supposed to be
	// if all checks pass...
	if (tx.contents.type === 'send') {
		// Send coins
		if (this.state[tx.contents.from].balance - tx.contents.amount < 0) {
			throw new Error('Not enough money!');
		}
		this.state[tx.contents.from].balance -= tx.contents.amount;
		this.state[tx.contents.to].balance += tx.contents.amount;
	} else {
		throw new Error('Invalid transaction type!');
	}
	// increment nonce
	this.state[tx.contents.from].nonce++;
	this.orderNonce++;
}
```

<br />

## Testing

In this last section we will use a few tests to make sure that our Proof of Authority network is functioning as intended.
- doubleSpendTest.js => same as usual
- orderNonceTest.js => sends transactions out of order on purpose to check that our PoA nodes can correctly process and order them
- PoATest.js => just send random tx to check basic PoA node functionality

> As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)

