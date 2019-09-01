var EthCrypto = require('eth-crypto')
var hexToBinary = require('hex-to-binary')
var {Node, getTxHash} = require('../nodeAgent')

// Add Client class which generates & sends transactions
class Client extends Node {
  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
    this.genesis = genesis
    this.blockchain = [] //longest chain
    this.allBlocks = []  //all blocks
    this.blockNumber = 0 //keep track of blocks added to blockchain despite getState()
    this.difficulty = 12
    const genesisBlock = {
      nonce: 82450,
      number: 0,
      coinbase: 0,
      difficulty: 1337,
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
    if (!this.isValidTxSig(tx)) return
    this.transactions.push(tx)      //add tx to mempool
    this.network.broadcast(this.pid, tx)
  }
  //Clones state, tries to apply the block to that state
  isValidBlock(block, state) {
    const tempState = JSON.parse(JSON.stringify(state))
    return this.applyBlock(block, tempState)
  }

  isValidBlockHash(block) {
    const blockHash = getTxHash(block)
    //Found block
    const binBlockHash = hexToBinary(blockHash.substr(2))
    const leadingZeros = parseInt(binBlockHash.substring(0, this.difficulty))
    return (leadingZeros === 0)
  }

  receiveBlock(block) {
    if (this.allBlocks.includes(block))
      return
    if (!this.isValidBlockHash(block))
      return
    //TODO Check that block is valid
    let state
    //if the block builds directly on the current head of the chain, append to chain
    if (block.parentHash === getTxHash(this.blockchain.slice(-1)[0])) {
      state = this.state
    } else {
      //TODO Request missing blocks from peers
      state = this.getState(block)
    }
    if (this.isValidBlock(block, state) &&
        block.number > this.blockNumber) {
      const numtxs = this.transactions.length
      this.removeTxs(block) //remove txs from tx pool
      if (numtxs!==this.transactions.length)
      this.blockNumber++ //increment
      this.allBlocks.push(block) //add block to all blocks received
      this.blockchain.push(block) //add block to own blockchain
      this.applyBlock(block, this.state)
      this.network.broadcast(this.pid, block) //broadcast new block to network
    }
  }
  removeTxs(block) {
    this.transactions = this.transactions.filter( function(tx) {
      return !block.contents.txList.includes(tx);
    })
  }

  // Send a request to peers for a missing block by blockHash
  requestBlock(blockHash) {

  }


  findBlock(blockHash) {
    for (let block of this.allBlocks) {
      if (getTxHash(block) === blockHash) {
        return block
      }
    }
    console.log('couldnt find block', blockHash.substring(0, 10))
    return false
  }
  // Fork choice
  // Only apply transactions which are contained in the longest chain
  // and returns the resulting state object.
  getState(block) {
    //a temp chain
    let tempChain = []
    let allBlocks = this.allBlocks
    let max = block.number
    //add max number of blocks to tempChain using parentHash
    //i is the current block number
    let prevHash = block.parentHash
    while(prevHash !== 0) {
      const prevBlock = this.findBlock(prevHash)
      if(!prevBlock) {
        console.log(this.pid.substring(0, 6),'all blocks:')
        for (let allblock of this.allBlocks) {
          console.log(getTxHash(allblock).substring(0, 10))
        }
      }
      tempChain.unshift(prevBlock)
      prevHash = tempChain[0].parentHash
    }
    //apply all txs from ordered list of blocks
    let newState = JSON.parse(JSON.stringify(this.genesis)) //clone the genesis state into newState
    for (let block of this.blockchain) {
      this.applyBlock(block, newState)
    }
    return newState
  }

  applyBlock(block, state) {
    const txList = block.contents.txList
    for (let tx of txList) {
      const successful = this.applyTransaction(tx, state)       //update state
      if(!successful)
        return false
    }
  return true
  }
}

module.exports = Client
