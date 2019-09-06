var EthCrypto = require('eth-crypto')
var Client = require('./PoWClient')
var {getTxHash} = require('../nodeAgent')

class SelfishMiner extends Client {
  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
    this.hashRate = 15; // hashRate = # hashes miner can try at each tick
    this.privateFork = [];
    this.privateForkHeight = 0;
    this.blockAttempt = this.createBlock();
  }
  tick() {
    // Mining
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
        if(!this.privateFork.length) this.privateForkHeight = this.blockNumber //record height of fork
        this.privateFork.push(validBlock)
        this.blockAttempt = this.createBlock();
        return;
      } this.blockAttempt.nonce++;
    }
  }

  receiveBlock(block) {
    const { parentHash } = this.blockAttempt;
    super.receiveBlock(block);
    const newHead = this.blockchain.slice(-1)[0];
    // if the block head has changed, mine on top of the new head
    //check to see if the other miners have caught up
    const publicForkLength = newHead.number - this.privateForkHeight
    const privateForkLength = this.privateFork.length
    if(getTxHash(newHead) !== parentHash) {
      if(privateForkLength === 0) {
        //new block extends chain, and have no private fork
        this.blockAttempt = this.createBlock(); // Start mining new block
      } else if (privateForkLength === 1  && publicForkLength === privateForkLength) {
        //public Fork has length 1 and private Fork has length 1, so broadcast
        this.broadcastPrivateFork()
      } else if (privateForkLength > 1 && publicForkLength === privateForkLength - 1) {
        //e.g. public Fork has length 3 and private fork has just reached length 2, so broadcast
        this.broadcastPrivateFork()
      } else if (privateForkLength > 0 && publicForkLength > privateForkLength) {
        //public blockchain has grown longer than private fork. Discard private fork and start mining on the public chain (longest chain)
        this.privateFork = [];
        this.blockAttempt = this.createBlock();
      }
    }
  }

  createBlock() {
    const tx = this.transactions.shift();
    const txList = [];
    if (tx) txList.push(tx);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const pfLength = this.privateFork.length
    const pfHead = this.privateFork.slice(-1)[0]
    const blockNum = (pfLength > 0) ? pfHead.number : this.blockNumber
    const parentHash = (pfLength > 0) ? getTxHash(pfHead) : getTxHash(this.blockchain.slice(-1)[0])
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

  broadcastPrivateFork() {
    console.log('Broadcasting private fork:', this.privateFork.length, 'blocks')
    this.blockchain = this.blockchain.slice(0, this.privateForkHeight)
    for(let block of this.privateFork) {
      this.blockchain.push(block)
      this.allBlocks.push(block)
      this.network.broadcast(this.pid, block)
    }
    this.blockNumber = this.blockchain.slice(-1)[0].number
    this.privateFork = []
    this.blockAttempt = this.createBlock();
  }
}

module.exports = SelfishMiner
