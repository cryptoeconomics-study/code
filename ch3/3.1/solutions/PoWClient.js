const EthCrypto = require('eth-crypto');
const hexToBinary = require('hex-to-binary');
const { Node, getTxHash } = require('../nodeAgent');

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

  // Check if a message is a transaction or a block
  onReceive(message) {
    // check the message.contents.type
    switch (message.contents.type) {
      // if it's 'send', receiveTx(message)
      case 'send':
        this.receiveTx(message);
        break;
      // if it's 'block', receiveBlock(message)
      case 'block':
        this.receiveBlock(message);
        break;
    }
  }

  // Process an incoming transaction
  receiveTx(tx) {
    // if we already have the transaction in our state, return to do nothing
    if (this.transactions.includes(tx)) return;
    // add the transaction to the pending transaction pool (this is often called the mempool)
    this.transactions.push(tx);
    // broadcast the transaction to the res of the network
    this.network.broadcast(this.pid, tx);
  }

  // Check the hash of an incoming block
  isValidBlockHash(block) {
    // hash the block
    const blockHash = getTxHash(block);
    // convert the hex string to binary
    const binBlockHash = hexToBinary(blockHash.substr(2));
    // check how many leading zeros the hash has
    const leadingZeros = parseInt(binBlockHash.substring(0, this.difficulty));
    // compare the amount of leading zeros in the block hash to the network difficulty and return a boolean if they match
    return leadingZeros === 0;
  }

  // Processing the transactions in a block
  applyBlock(block) {
    // get all the transactions in block.contents
    const { txList } = block.contents;
    // for every transaction in the transaction list
    for (const tx of txList) {
      // process the transaction to update our view of the state
      this.applyTransaction(tx);
      // if the transaction does not come from the 0 address (which is a mint transaction for miners and has no sender)
      if (tx.contents.from !== 0) {
        // check any pending transactions with invalid nonces to see if they are now valid
        this.applyInvalidNonceTxs(tx.contents.from); // update state
      }
    }
  }

  // Update the state with transactions which are contained in the longest chain and return the resulting state object (this process is often referred to as the "fork choice" rule)
  updateState() {
    // create an array to represent a temp chain
    const tempChain = [];
    // create a variable to represent all the blocks that we have already processed
    const { allBlocks } = this;
    // find the highest block number in all the blocks
    const max = Math.max.apply(Math, allBlocks.map(block => block.number));
    // add the highestBlockNumber to tempChain using blockNumber
    for (const block of allBlocks) {
      if (block.number === max) {
        tempChain.push(block);
        break;
      }
    }
    // add max number of blocks to tempChain using parentHash
    for (let i = max; i > 0; i--) {
      const prevHash = tempChain[0].parentHash;
      for (const block of allBlocks) {
        if (getTxHash(block) === prevHash) {
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
    // return the new state
    return this.state;
  }

  // Receiving a block, making sure it's valid, and then processing it
  receiveBlock(block) {
    // if we've already seen the block return to do nothing
    if (this.allBlocks.includes(block)) return;
    // if the blockhash is not valid return to do nothing
    if (!this.isValidBlockHash(block)) return;
    // if checks pass, add block to all blocks received
    this.allBlocks.push(block);
    // if the block builds directly on the current head of the chain, append to chain
    if (block.parentHash === getTxHash(this.blockchain.slice(-1)[0])) {
      // incriment the block number
      this.blockNumber++;
      // add the block to our view of the blockchain
      this.blockchain.push(block);
      // process the block
      this.applyBlock(block);
    } else {
      this.allBlocks.push(block);
      // update our state with the new block
      this.updateState();
    }
    // broadcast the block to the network
    this.network.broadcast(this.pid, block);
  }
}

module.exports = Client;
