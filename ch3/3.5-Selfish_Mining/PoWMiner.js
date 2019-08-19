var EthCrypto = require('eth-crypto')
var Client = require('./PoWClient')
var {getTxHash} = require('../nodeAgent')

class Miner extends Client {
  onReceive (message) {
    if (message.contents.type === 'send') {
      if (this.transactions.includes(message)) {
        return
      }
      this.transactions.push(message)      //add tx to mempool
      this.applyTransaction(message)       //update state
      this.applyInvalidNonceTxs(message.contents.from) //update state
      this.getState() //check if blockchain is the longest sequence
      let newBlock = this.mineBlock(message)
      if (newBlock === 'FAIL') {
        console.log("no valid block found, giving up")
      } else {
        this.blockNumber++ //increment
        this.blockchain.push(newBlock) //add to own blockchain
        this.allBlocks.push(newBlock) //add to allBlocks
        this.network.broadcast(this.pid, newBlock) //broadcast new block to network
      }

    } else if (message.contents.type === 'block') {
      if (message.parentHash === getTxHash(this.blockchain.slice(-1)[0])) {
        this.blockNumber++ //increment
        this.blockchain.push(message)      //add block to own blockchain
        this.allBlocks.push(message)      //add block to all blocks received
      } else {
        this.allBlocks.push(message)
        this.getState() //check if blockchain is the longest sequence
      }
    }
  }

  mineBlock (tx) {
    //returns an integer between 3 and 4 so we can have blocks with
    //different difficulties for fork choice (MDN example)
    // let difficulty = Math.floor(Math.random() * (4 - 3 + 1)) + 3
    let difficulty = 3
    let maxAttempts = 100000
    let timestamp = Math.round(new Date().getTime() / 1000)

    // no mint tx for now :-)
    // const unsignedTx = {
    //     type: 'mint',
    //     amount: 3,
    //     from: 0,
    //     to: this.wallet.address,
    //     nonce: 0
    // }
    //
    // const blockRewardTx = {
    //   contents: unsignedTx,
    //   sig: EthCrypto.sign(this.wallet.privateKey, getTxHash(unsignedTx))
    // }

    const newBlock = {
      number: this.blockNumber,
      coinbase: this.wallet.address,
      difficulty: difficulty,
      parentHash: getTxHash(this.blockchain.slice(-1)[0]),
      timestamp: timestamp,
      contents: {
        type: 'block',
        txList: [
          // blockRewardTx,
          tx
        ]
      }
    }

    // Proof of work on the blocks
    // Add anti-spam protection with proof of work on each block
    for (let i = 0; i < maxAttempts; i++) {
      let blockAttempt = Object.assign({'nonce': i}, newBlock)
      let blockHash = getTxHash(blockAttempt)
      if (parseInt(blockHash.substring(0, 2 + difficulty)) === 0) {
        return blockAttempt
      }
    }
    return 'FAIL'
  }
}

module.exports = Miner
