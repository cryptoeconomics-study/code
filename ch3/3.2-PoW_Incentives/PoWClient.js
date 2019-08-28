var EthCrypto = require('eth-crypto')
var {Node, getTxHash} = require('../nodeAgent')

// Add Client class which generates & sends transactions
class Client extends Node {
  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
    this.blockchain = [] //longest chain
    this.allBlocks = []  //all blocks
    this.blockNumber = 0 //keep track of blocks added to blockchain despite getState()

    const genesisBlock = {
      nonce: 0,
      number: 0,
      coinbase: 0,
      difficulty: 9000,
      parentHash: 0,
      timestamp: 0,
      contents: {
        type: 'block',
        txList: []
      }
    }
    this.blockchain.push(genesisBlock)
    this.allBlocks.push(genesisBlock)
  }

  onReceive(message) {
    switch(message.contents.type) {
      case 'send':
        this.receiveTx(message)
        break
      case 'block':
        this.receiveBlock(message)
        break
    }
  }

  receiveTx(tx) {
    if (this.transactions.includes(tx)) return
    this.transactions.push(tx)      //add tx to mempool
    this.network.broadcast(this.pid, tx)
  }

  receiveBlock(block) {
    //TODO Check that block is valid
    if (this.allBlocks.includes(block)) return
    this.allBlocks.push(block) //add block to all blocks received
    //if the block builds directly on the current head of the chain, append to chain
    if (block.parentHash === getTxHash(this.blockchain.slice(-1)[0])) {
      this.blockNumber++ //increment
      this.blockchain.push(block) //add block to own blockchain
      this.applyBlock(block)
    } else {
      //TODO Check block number to see that the block is even going to make a longer chain
      //TODO Request missing blocks from peers
      this.allBlocks.push(block)
      this.getState() //check if blockchain is the longest sequence
    }
    this.network.broadcast(this.pid, block) //broadcast new block to network
  }

  // Send a request to peers for a missing block by blockHash
  requestBlock(blockHash) {


  }



  // Fork choice
  // Only apply transactions which are contained in the longest chain
  // and returns the resulting state object.
  getState() {
    //a temp chain
    let tempChain = []
    let allBlocks = this.allBlocks
    //return max blocknumber from allBlocks
    let max = Math.max.apply(Math, allBlocks.map(function(block) { return block.number; }))
    //add the highestBlockNumber to tempChain using blockNumber
    for (let block of allBlocks) { //TODO optimize this...Once there are many blocks in allBlocks, this may be SLOW af
      if (block.number === max) {
        tempChain.push(block)
        break;
      }
    }
    //add max number of blocks to tempChain using parentHash
    //i is the current block number
    for (let i = max; i > 0; i--) {
      const prevHash = tempChain[0].parentHash
      for (let block of allBlocks) {
        if (getTxHash(block) === prevHash) { //TODO verify blockhash before adding to allBlocks
          tempChain.unshift(block) //add block to front of array
          break;
        }
      }
    }
    //save the ordered sequence
    this.blockchain = tempChain
    //apply all txs from ordered list of blocks
    for (let block of this.blockchain) {
      this.applyBlock(block)
    }
    return this.state
  }

  applyBlock(block) {
    const txList = block.contents.txList
    for (let tx of txList) {
      this.applyTransaction(tx)       //update state
      if (tx.contents.from !== 0) { //mint tx is excluded
        this.applyInvalidNonceTxs(tx.contents.from) //update state
      }
    }
  }
}

module.exports = Client
