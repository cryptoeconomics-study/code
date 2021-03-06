const EthCrypto = require('eth-crypto');
const hexToBinary = require('hex-to-binary');
const { Node, getTxHash } = require('../../nodeAgent');

// Add Client class which generates & sends transactions
class Client extends Node {
  constructor(wallet, genesis, network) {
    super(wallet, genesis, network);
    this.blockchain = []; // longest chain
    this.allBlocks = []; // all blocks
    this.blockNumber = 0; // keep track of blocks added to blockchain despite getState()
    this.difficulty = 13;

    const genesisBlock = {
      nonce: 0,
      number: 0,
      coinbase: 0,
      difficulty: 9000,
      parentHash: 0,
      timestamp: 0,
      contents: {
        type: 'block',
        txList: [],
      },
    };
    this.blockchain.push(genesisBlock);
    this.allBlocks.push(genesisBlock);
  }

  onReceive(message) {
    switch (message.contents.type) {
      case 'send':
        this.receiveTx(message);
        break;
      case 'block':
        this.receiveBlock(message);
        break;
    }
  }

  receiveTx(tx) {
    if (this.transactions.includes(tx)) return;
    this.transactions.push(tx); // add tx to mempool
    this.network.broadcast(this.pid, tx);
  }

  isValidBlockHash(block) {
    const blockHash = getTxHash(block);
    // Found block
    const binBlockHash = hexToBinary(blockHash.substr(2));
    const leadingZeros = parseInt(binBlockHash.substring(0, this.difficulty));
    return leadingZeros === 0;
  }

  receiveBlock(block) {
    if (this.allBlocks.includes(block)) return;
    if (!this.isValidBlockHash(block)) return;
    this.allBlocks.push(block); // add block to all blocks received
    // if the block builds directly on the current head of the chain, append to chain
    if (block.parentHash === getTxHash(this.blockchain.slice(-1)[0])) {
      this.blockNumber++; // increment
      this.blockchain.push(block); // add block to own blockchain
      this.applyBlock(block);
    } else {
      this.allBlocks.push(block);
      this.updateState(); // check if blockchain is the longest sequence
    }
    this.network.broadcast(this.pid, block); // broadcast new block to network
  }

  // Fork choice
  // Only apply transactions which are contained in the longest chain
  // and returns the resulting state object.
  updateState() {
    // a temp chain
    const tempChain = [];
    const { allBlocks } = this;
    // return max blocknumber from allBlocks
    const max = Math.max.apply(Math, allBlocks.map(block => block.number));
    // add the highestBlockNumber to tempChain using blockNumber
    for (const block of allBlocks) {
      // TODO optimize this...Once there are many blocks in allBlocks, this may be SLOW af
      if (block.number === max) {
        tempChain.push(block);
        break;
      }
    }
    // add max number of blocks to tempChain using parentHash
    // i is the current block number
    for (let i = max; i > 0; i--) {
      const prevHash = tempChain[0].parentHash;
      for (const block of allBlocks) {
        if (getTxHash(block) === prevHash) {
          // TODO verify blockhash before adding to allBlocks
          tempChain.unshift(block); // add block to front of array
          break;
        }
      }
    }
    // save the ordered sequence
    this.blockchain = tempChain;
    // apply all txs from ordered list of blocks
    for (const block of this.blockchain) {
      this.applyBlock(block);
    }
    return this.state;
  }

  applyBlock(block) {
    const { txList } = block.contents;
    for (const tx of txList) {
      this.applyTransaction(tx); // update state
      if (tx.contents.from !== 0) {
        // mint tx is excluded
        this.applyInvalidNonceTxs(tx.contents.from); // update state
      }
    }
  }
}

module.exports = Client;
