const EthCrypto = require('eth-crypto');
const NetworkSimulator = require('../networkSim');
const { Node, getTxHash } = require('../nodeAgent');

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
