const EthCrypto = require('eth-crypto');
const Client = require('./PoWClient');
const { getTxHash } = require('../nodeAgent');

// This Miner class will extend the client we created in 3.1
class Miner extends Client {
  constructor(wallet, genesis, network) {
    super(wallet, genesis, network);
    // create a block in the constructor so that we have something to start mining on
    this.blockAttempt = this.createBlock();
    // hashRate = # hashes miner can try at each tick
    this.hashRate = 5;
  }

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

  // What we do when we get a new block (from ourselves or the network)
  receiveBlock(block) {
    // create a variable to hold the hash of the old block so that we can mine on top of it
    // use the receiveBlock() function from the client to check the block and broadcast it to to the network
    // update the head of the local state of our blockchain
    // if the block head has changed, mine on top of the new head
    // - start creating/mining a new block
  }

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
}

module.exports = Miner;
