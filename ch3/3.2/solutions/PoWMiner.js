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
    const tx = this.transactions.shift();
    const txList = [];
    if (tx) txList.push(tx);

    // get the timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);
    // create a new block
    const newBlock = {
      // nonce
      nonce: 0,
      // block number
      number: this.blockNumber + 1,
      // give ourselves the coinbase reward for finding the block
      coinbase: this.wallet.address,
      // log the difficulty of the network
      difficulty: this.difficulty,
      // show the hash of the block that matches the network difficulty
      parentHash: getTxHash(this.blockchain.slice(-1)[0]),
      // timestamp
      timestamp,
      // transactions
      contents: {
        type: 'block',
        txList,
      },
    };
    // return the block
    return newBlock;
  }

  // What we do when we get a new block (from ourselves or the network)
  receiveBlock(block) {
    // create a variable to hold the hash of the old block so that we can mine on top of it
    const { parentHash } = this.blockAttempt;
    // use the receiveBlock() function from the client to check the block and broadcast it to to the network
    super.receiveBlock(block);
    // update the head of the local state of our blockchain
    const newHead = this.blockchain.slice(-1)[0];
    // if the block head has changed, mine on top of the new head
    if (getTxHash(newHead) !== parentHash) {
      // Start creating/mining a new block
      this.blockAttempt = this.createBlock();
    }
  }

  // Start mining
  tick() {
    for (let i = 0; i < this.hashRate; i++) {
      // if we find a valid block
      if (this.isValidBlockHash(this.blockAttempt)) {
        // get the valid blockhash
        const blockHash = getTxHash(this.blockAttempt);
        // log the results to the console
        console.log(
          this.pid.substring(0, 6),
          'found a block:',
          blockHash.substring(0, 10),
          'at height',
          this.blockAttempt.number,
        );
        // create the valid block
        const validBlock = this.blockAttempt;
        // process the valid block
        this.receiveBlock(validBlock);
        // end the loop and keep mining
        return;
      }
      // if we did not find a block, incriment the nonce and try again
      this.blockAttempt.nonce++;
    }
  }
}

module.exports = Miner;
