var EthCrypto = require('eth-crypto')
var Client = require('./PoWClient')
var {getTxHash} = require('../nodeAgent')

var difficulty = 4

class Miner extends Client {

  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
    this.blockAttempt = this.createBlock()
    this.hashRate = 5   // hashRate = # hashes miner can try at each tick
  }
  tick() {
    //Mining
    for (let i = 0; i < this.hashRate; i++) {
      let blockHash = getTxHash(this.blockAttempt)
      // console.log(blockHash.substring(0, 2 + difficulty))
      // console.log(parseInt(blockHash.substring(0, 2 + difficulty)))
      //Found block
      if (parseInt(blockHash.substring(0, 2 + difficulty)) === 0) {
        console.log(this.pid.substring(0, 6), 'found a block at height', this.blockAttempt.number)
        const validBlock = this.blockAttempt
        this.receiveBlock(validBlock)
        return
      }
      else this.blockAttempt.nonce++
    }
  }
  receiveBlock(block){
    const parentHash = this.blockAttempt.parentHash
    super.receiveBlock(block)
    const newHead = this.blockchain.slice(-1)[0]
    //if the block head has changed, mine on top of the new head
    if(getTxHash(newHead) !== parentHash) {
      this.blockAttempt = this.createBlock() //Start mining new block
    }
  }
  createBlock() {
    const tx = this.transactions.shift()
    let txList = []
    if (tx) txList.push(tx)

    let timestamp = Math.round(new Date().getTime() / 1000)
    const newBlock = {
      nonce: 0,
      number: this.blockNumber+1,
      coinbase: this.wallet.address,
      difficulty: difficulty,
      parentHash: getTxHash(this.blockchain.slice(-1)[0]),
      timestamp: timestamp,
      contents: {
        type: 'block',
        txList
      }
    }
    return newBlock
  }
}

module.exports = Miner
