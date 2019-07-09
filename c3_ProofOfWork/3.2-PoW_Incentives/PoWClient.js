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
    //a temp store of tempChain[lastblock].parentHash
    let prevHash = 0
    //return max blocknumber from allBlocks
    let max = Math.max.apply(Math, this.allBlocks.map(function(block) { return block.number; }))
    //debug.. inside filter function this.allBlocks returns Cannot read property 'allBlocks' of undefined
    let allBlocks = this.allBlocks
    //add the highestBlockNumber to tempChain using blockNumber
    Object.keys(allBlocks).filter(function(block) {
      if (allBlocks[block].number === max) {
        if (tempChain.length === 0) { //should only add one block. if two competing, pick the first one by position in allBlocks array
          tempChain.push(allBlocks[block])
        }
      }
    })
    //add max number of blocks to tempChain using parentHash
    for (let i = tempChain.length; i < max; i++) {
      // console.log('now my prevhash is', prevHash)
      Object.keys(allBlocks).filter(function(block) {
        prevHash = tempChain[tempChain.length -1].parentHash
        if (getTxHash(allBlocks[block]) === prevHash) {
          tempChain.push(allBlocks[block])
        }
      })
    }
    //save the ordered sequence
    this.blockchain = tempChain.reverse()
    //apply all txs from ordered list of blocks
    for (let i = 0; i < this.blockchain.length; i++) {
      for (let j = 0; j < this.blockchain[i].contents.txList.length; j++) {
        let tx = this.blockchain[i].contents.txList[j]
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
