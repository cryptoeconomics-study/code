var EthCrypto = require('eth-crypto')
var Client = require('./PoWClient')
var {getTxHash} = require('../nodeAgent')

class Miner extends Client {

  constructor (wallet, genesis, network) {
    super(wallet, genesis, network)
    this.blockAttempt = this.createBlock()
    this.hashRate = 5   // hashRate = # hashes miner can try at each tick
  }
  tick() {
    //Mining
    for (let i = 0; i < this.hashRate; i++) {
      if (this.isValidBlockHash(this.blockAttempt)) {
        const blockHash = getTxHash(this.blockAttempt)
        console.log(this.pid.substring(0, 6), 'found a block:', blockHash.substring(0, 10),'at height', this.blockAttempt.number)
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
    const tx = this.transactions[0]
    let txList = []
    if (tx) txList.push(tx)

    let timestamp = Math.round(new Date().getTime() / 1000)
    const newBlock = {
      nonce: 0,
      number: this.blockNumber+1,
      coinbase: this.wallet.address,
      difficulty: this.difficulty,
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
