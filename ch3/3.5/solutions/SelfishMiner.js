const EthCrypto = require('eth-crypto');
const Client = require('../PoWClient');
const { getTxHash } = require('../../nodeAgent');

class SelfishMiner extends Client {
  constructor(wallet, genesis, network) {
    super(wallet, genesis, network);
    this.hashRate = 15;
    // the miner's secret fork of the network
    this.privateFork = [];
    // amount of valid blocks the miner has created ahead of the main chain
    this.privateForkHeight = 0;
    this.blockAttempt = this.createBlock();
  }

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
        if (!this.privateFork.length) this.privateForkHeight = this.blockNumber;
        // add our latest valid block to our fork
        this.privateFork.push(validBlock);
        // start creating a new block
        this.blockAttempt = this.createBlock();
        return;
      }
      this.blockAttempt.nonce++;
    }
  }

  // Receiving blocks
  receiveBlock(block) {
    const { parentHash } = this.blockAttempt;
    super.receiveBlock(block);
    const newHead = this.blockchain.slice(-1)[0];
    // if the block head has changed, mine on top of the new head
    // check to see if the other miners have caught up
    const publicForkLength = newHead.number - this.privateForkHeight;
    const privateForkLength = this.privateFork.length;
    if (getTxHash(newHead) !== parentHash) {
      if (privateForkLength === 0) {
        // new block extends chain, and have no private fork so start mining a new block
        this.blockAttempt = this.createBlock();
      } else if (
        privateForkLength === 1
        && publicForkLength === privateForkLength
      ) {
        // public Fork has length 1 and private Fork has length 1, so broadcast
        this.broadcastPrivateFork();
      } else if (
        privateForkLength > 1
        && publicForkLength === privateForkLength - 1
      ) {
        // e.g. public Fork has length 3 and private fork has just reached length 2, so broadcast
        this.broadcastPrivateFork();
      } else if (
        privateForkLength > 0
        && publicForkLength > privateForkLength
      ) {
        // public blockchain has grown longer than private fork. Discard private fork and start mining on the public chain (longest chain)
        this.privateFork = [];
        this.blockAttempt = this.createBlock();
      }
    }
  }

  // Creating a new block
  createBlock() {
    const tx = this.transactions.shift();
    const txList = [];
    if (tx) txList.push(tx);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const pfLength = this.privateFork.length;
    const pfHead = this.privateFork.slice(-1)[0];
    const blockNum = pfLength > 0 ? pfHead.number : this.blockNumber;
    const parentHash = pfLength > 0
      ? getTxHash(pfHead)
      : getTxHash(this.blockchain.slice(-1)[0]);
    const newBlock = {
      nonce: 0,
      number: blockNum + 1,
      coinbase: this.wallet.address,
      difficulty: this.difficulty,
      parentHash,
      timestamp,
      contents: {
        type: 'block',
        txList,
      },
    };
    return newBlock;
  }

  // Broadcasting our private fork
  broadcastPrivateFork() {
    console.log(
      'Broadcasting private fork:',
      this.privateFork.length,
      'blocks',
    );
    // resize our view of the blockchain to add the length of our private fork
    this.blockchain = this.blockchain.slice(0, this.privateForkHeight);
    // broadcast all the blocks on our private fork to the network
    for (const block of this.privateFork) {
      // add the private block to our view of the blockchain
      this.blockchain.push(block);
      // add the private block to our list of all the blocks
      this.allBlocks.push(block);
      // broadcast the private block to the network
      this.network.broadcast(this.pid, block);
    }
    // update block number
    this.blockNumber = this.blockchain.slice(-1)[0].number;
    // reset private fork
    this.privateFork = [];
    // start mining a new block
    this.blockAttempt = this.createBlock();
  }
}

module.exports = SelfishMiner;
