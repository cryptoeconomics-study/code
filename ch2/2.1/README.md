> The code challenges in this course build upon each other. It's highly recommended that you start from the beginning. If you haven't already, get started with our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup).

> The chapter 2 coding challenges use a network simulation. This is created by nodeAgent.js, networkSim.js, and netTest.js in the `ch2` directory. You do not need to understand how this network simulation works to complete the chapter two coding challenges, but we highly recommend it. The README in the `ch2` directory will give you a high level overview of the network demo. Each file also has detailed code comments explaining how each function works.

<br />

## Networks and Synchrony

In chapter one we had a self contained payments processor demo. This worked fine since the state and all the logic of the state transition function was contained within a centralized file. Now we're going to explore what it's like to process transactions on a network where each node verifies transactions and propagates them to other nodes on the network.

<br />

## Spender Nodes

As mentioned in the disclaimer, the network demo has already been set up for us in the `ch2` directory. In this section we will be creating a Spender class that extends the basic Node class. Spender represents a user on the network who is running a node and sending transactions. These spenders have a unique property in that they are altruistic (or naive) and only send transactions when they have money to spend. As we'll see, this allows the network to function for a while, but due to latency issues there is a problem.
```
// Spender is a Node that sends a random transaction at every tick()
// Spender extends the Node class in nodeAgent.js
// - this means that everything that is available to the Node class is imported and available to the Spender class as well
class Spender extends Node {
  // returns a random wallet address (excluding the Spender)
  getRandomReceiver() {
    // TODO
    // create array of Node addresses that does not include this Node
    // pick a node at random from the nodes that are not this node
    // return the address of that random node
  }

  // tick() makes stuff happen
  // in this case we're simulating agents performing actions on a network
  // available options are
  // - do nothing
  // - send a transaction
  tick() {
    // TODO
    // check if we have money
    // if we have no money, don't do anything
    // print a fun message to the console stating that we're not doing anything
    // return to exit the function
    // if we do have money
    // Generate a random transaction
    // add the transaction to our historical transaction list
    // process the transaction
    // broadcast the transaction to the network
  }
}

```

<br />

## Testing The Spender Nodes

To test our new Spender class we're going to try running it on our network simulation. Since the majority of the logic for the Node class (which Spender extends) has already been written, and what we really want to test is the latency, we're going to run the file itself. In the `invalidWithHonestNodesTest.js` file you'll see a demo at the end of the file. If you run `node invalidWithHonestNodesTest.js` in the `2.1` directory you'll see the network run for a bit, then... snafu! Due to the latency we introduced the system should fail and show us why. If you get stuck check the `solutions` directory or ask for help on the [forum](https://forum.cryptoeconomics.study/).

<br />
