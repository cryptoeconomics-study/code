> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).

> ! The chapter 2 coding challenges use a network simulation. This is created by nodeAgent.js, networkSim.js, and netTest.js in the `ch2` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch2` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

## Double Spending

As we mentioned in 2.1, the Spender nodes are altruistic (or naive) in that they only try to send transactions when they have funds. They could, however, try to send multiple transactions at the same time, and... if network latency was great enough, they might be able to fool multiple nodes into thinking they've both received the same transaction.

The way to do this would be to duplicate the same transaction (including the nonce), but with different receivers. To each recipient the transactions would look valid, but when broadcast to the network and compared to the state of other nodes there would be a conflict. At best this would result in some disgruntled nodes and a reversion of one of the transactions, but this could potentially also create a network fork where one set of nodes accepts one of the transactions and another set of nodes accepts another. This would create 2 different versions of the state, and thus 2 different networks.

To better understand double spends let's try to implement a double spend attack ourselves! In `doubleSpendTest.js` the network has already been setup, but it's up to you to perform the double spend.
```
// Attempting to double spend!
// TODO: designate the node that will double spend
// TODO: designate the nodes that we will perform the attack on
// TODO: create 2 identical transactions that have different recipients
// TODO: broadcast both transaction to the network at the same time
```

<br />

## Testing The Attack

You can run the network simulation at any time to check the results of your attack. This is done by running `node doubleSpendTest.js` in the `2.2` directory. As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)

> Throughout the rest of chapter 2 we will use slightly modified versions of `doubleSpendTest.js` to see how our different networks handle double spending
