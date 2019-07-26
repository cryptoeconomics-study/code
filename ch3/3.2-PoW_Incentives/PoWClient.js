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

  onReceive (message) {
    if (message.contents.type === 'block') {
      // this.blockchain.push(message)
      this.allBlocks.push(message)
      // this.getState()
    } else {
      //do nothing for now, not a miner
      return
    }
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
      const txList = block.contents.txList
      for (let tx of txList) {
        this.applyTransaction(tx)       //update state
        if (tx.contents.from !== 0) { //mint tx is excluded
          this.applyInvalidNonceTxs(tx.contents.from) //update state
        }
      }
    }
    return this.state
  }
}

module.exports = Client
