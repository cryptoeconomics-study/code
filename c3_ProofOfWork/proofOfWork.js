var EthCrypto = require('eth-crypto')
var network = require('./networksim')()

function getHash (data) {
  return EthCrypto.hash.keccak256(JSON.stringify(data))
}

// //fork choice: requires comparing accumulated difficulty in two chains.
// //for now compare lengths of this.blockchain and aBlockchain
// function forkChoice(aBlockchain) {
//   console.log((this.blockhain.length > aBlockchain.length) ? this.blockhain : aBlockchain)
//   return ((this.blockhain.length > aBlockchain.length) ? this.blockhain : aBlockchain)
// }
//
// //applies all the transactions in the longest chain and returns the resulting state object
// function getState(aBlockchain) {
//   let cannonicalChain = forkChoice(aBlockchain)
//   console.log(cannonicalChain)
//   for (let i = 0; i < cannonicalChain.length; i++) {
//     this.applyTransaction(cannonicalChain[i].contents.data)       //apply tx to state / ledger
//     this.applyInvalidNonceTxs(cannonicalChain[i].contents.data.contents.from) //apply tx to state / ledger
//   }
//   return this.state
// }

class Miner {
  constructor () {
    this.transactions = [] //all txs
    this.blockchain = []    //all blocks
    this.invalidNonceTxs = {}
    this.lastBlockHash = 0
  }

  //collect txs from network
  onReceive (tx) {
    console.log('received a tx!', tx)
    if (this.transactions.includes(tx)) {
      console.log('skipped a tx!')
      return
    }
    this.transactions.push(tx)      //add tx to mempool
    this.applyTransaction(tx)       //update state
    this.applyInvalidNonceTxs(tx.contents.from) //update state
    let newBlock = this.mineBlock(tx)  //mine a block with the tx
    this.lastBlockHash = getHash(newBlock)  //set lastBlockHash for tx block:content+sig
    this.network.broadcast(this.pid, newBlock) //broadcast new block to network
    // console.log('my tx list is: ' +  this.transactions.length + ' long')
    // console.log('my badtx list is:', this.invalidNonceTxs)
  }

  //collect blocks from network
  onNewBlock (block) {
    console.log('received a block!')
    if (this.blockchain.includes(block)) {
      console.log('skipped a block!')
      return
    }
    // console.log(block.contents.nonce)
    if (block.contents.prevHash !== this.lastBlockHash) {
      console.log('skipped a block!')
      return
    }

    this.blockchain.push(block)      //add tx to own blockchain
    this.lastBlockHash = getHash(block)  //set lastBlockHash for tx block:content+sig
    let tx = block.contents.data
    // console.log('txcontents: ',tx.contents.from)
    this.applyTransaction(tx)       //update state
    this.applyInvalidNonceTxs(tx.contents.from) //update state
    console.log('addr ' + this.wallet.address + ' block count : ' + this.blockchain.length )
    // console.log('my chain is: ', this.blockchain)
    // console.log('inside the block: ', block.contents.data)
  }

  tick () {

  }

  //makes block
  mineBlock (tx) {
    let difficulty = 3
    let maxAttempts = 100000
    let timestamp = Math.round(new Date().getTime() / 1000)
    const unsignedBlock = {
      type: 'block',
      prevHash: this.lastBlockHash,
      timestamp: timestamp,
      data: tx
    }
    for (let i = 0; i < maxAttempts; i++) {
      let blockAttempt = Object.assign({'nonce': i}, unsignedBlock)
      let blockHash = getHash(blockAttempt)
      // console.log('nonce: ' + i + ' blockHash: ' + blockHash)
      if (parseInt(blockHash.substring(0, 2 + difficulty)) === 0) {
        const newBlock = {
          contents: blockAttempt,
          sig: EthCrypto.sign(this.wallet.privateKey, getHash(blockHash)) //sign the unsignedBlock + nonce
        }
        // console.log('new block found: ', newBlock)
        // this.lastBlockHash = blockHash ... i want the lastBlockHash to include the sig
        return newBlock
      }
    }
    return 'FAIL'
  }

}

class Client extends Miner {
  constructor (wallet, genesis, network) {
    super()
    this.wallet = wallet
    this.p2pNodeId = EthCrypto.createIdentity()
    this.pid = this.p2pNodeId.address
    this.network = network
    this.state = genesis
  }

  generateTx (to, amount) {
    const unsignedTx = {
      type: 'send',
      amount: amount,
      from: this.wallet.address,
      to: to,
      nonce: this.state[this.wallet.address].nonce
    }
    const tx = {
      contents: unsignedTx,
      sig: EthCrypto.sign(this.wallet.privateKey, getHash(unsignedTx))
    }
    //broadcast new tx to network
    this.network.broadcast(this.pid, tx)
  }

  applyTransaction (tx) {
    // Check the from address matches the signature
    // console.log('i was sent tx: ', tx)
    const signer = EthCrypto.recover(tx.sig, getHash(tx.contents))
    if (signer !== tx.contents.from) {
      throw new Error('Invalid signature!')
    }
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in this.state)) {
      this.state[[tx.contents.to]] = {
        balance: 0,
        nonce: 0
      }
    }
    // Check that the nonce is correct for replay protection
    if (tx.contents.nonce !== this.state[[tx.contents.from]].nonce) {
      // console.log('txnonce: ', tx.contents.nonce + ' txfrom: ', tx.contents.from)
      // console.log('state nonce: ', this.state[[tx.contents.from]].nonce )
      // If it isn't correct, then we should add it to transaction to invalidNonceTxs
      if (!(tx.contents.from in this.invalidNonceTxs)) {
        this.invalidNonceTxs[tx.contents.from] = {}
      }
      this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx
      return
    }
    if (tx.contents.type === 'send') { // Send coins
      if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!')
      }
      this.state[[tx.contents.from]].balance -= tx.contents.amount
      this.state[[tx.contents.to]].balance += tx.contents.amount
    } else {
      throw new Error('Invalid transaction type!')
    }
    this.state[[tx.contents.from]].nonce += 1
  }

  applyInvalidNonceTxs (address) {
    // console.log('my addr:', address)
    const targetNonce = this.state[address].nonce
    if (address in this.invalidNonceTxs && targetNonce in this.invalidNonceTxs[address]) {
      this.applyTransaction(this.invalidNonceTxs[address][targetNonce])
      delete this.invalidNonceTxs[address][targetNonce]
      this.applyInvalidNonceTxs(address)
    }
  }

}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
for (let i = 0; i < numNodes; i++) {
  wallets.push(EthCrypto.createIdentity())
  genesis[wallets[i].address] = {
    balance: 0,
    nonce: 0
  }
}
// Give wallet 0 some money at genesis
genesis[wallets[0].address] = {
  balance: 100,
  nonce: 0
}

const nodes = []
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(new Client(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  network.connectPeer(nodes[i], 3)
}

// const transactions = [nodes[0].generateTx(nodes[1].wallet.address, 100)]
//// TODO: multiple tx
nodes[0].generateTx(nodes[1].wallet.address, 10)
for (let i = 0; i < 800; i++) {
  network.tick()
}
nodes[0].generateTx(nodes[1].wallet.address, 5)
for (let i = 0; i < 800; i++) {
  network.tick()
}

console.log('state 0: ', nodes[0].state)
console.log('state 1: ', nodes[1].state)
