var EthCrypto = require('eth-crypto')
var network = require('./networksim')()

function getHash (data) {
  return EthCrypto.hash.keccak256(JSON.stringify(data))
}

// Add Client class which generates & sends transactions
class Client {
  constructor (wallet, genesis, network) {
    // Blockchain identity
    this.wallet = wallet
    // P2P Node identity -- used for connecting to peers
    this.p2pNodeId = EthCrypto.createIdentity()
    this.pid = this.p2pNodeId.address
    this.network = network
    this.state = genesis
    this.transactions = []
    this.blockchain = []    //longest chain
    this.allBlocks = []    //all blocks received
    this.invalidNonceTxs = {}

    const genesisBlock = {
      nonce: 0,
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

  }

  onReceive (message) {
    if (message.contents.type === 'block') {
      this.allBlocks.push(message)
      this.getState()
    } else {
      //do nothing for now, not a miner
      return
    }
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
    if (tx.contents.type === 'send') { // Send coins
      // Check the from address matches the signature
      const signer = EthCrypto.recover(tx.sig, getHash(tx.contents))
      if (signer !== tx.contents.from) {
        throw new Error('Invalid signature!')
      }
      // Check there is enough balance for tx
      if (this.state[[tx.contents.from]].balance - tx.contents.amount < 0) {
        // throw new Error('Not enough money!')
        console.log('not enough money...yet')
        return
      }
      // Check that the nonce is correct for replay protection
      if (tx.contents.nonce !== this.state[[tx.contents.from]].nonce) {
        // If it isn't correct, then we should add it to transaction to invalidNonceTxs
        if (!(tx.contents.from in this.invalidNonceTxs)) {
          this.invalidNonceTxs[tx.contents.from] = {}
        }
        this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx
        return
      }
      // If we don't have a record for this address, create one
      if (!(tx.contents.to in this.state)) {
        this.state[[tx.contents.to]] = {
          balance: 0,
          nonce: 0
        }
      }
      // Update state
      this.state[[tx.contents.from]].balance -= tx.contents.amount
      this.state[[tx.contents.to]].balance += tx.contents.amount
      this.state[[tx.contents.from]].nonce += 1
    } else if (tx.contents.type === 'mint') { //Block reward
      // Check the from address matches the signature
      const signer = EthCrypto.recover(tx.sig, getHash(tx.contents))
      if (signer !== tx.contents.to) {
        throw new Error('Invalid signature in mint tx!')
      }
      // Update state
      this.state[[tx.contents.to]].balance += tx.contents.amount
    } else {
      throw new Error('Invalid transaction type!')
    }
  }

  applyInvalidNonceTxs (address) {
    const targetNonce = this.state[address].nonce
    if (address in this.invalidNonceTxs && targetNonce in this.invalidNonceTxs[address]) {
      this.applyTransaction(this.invalidNonceTxs[address][targetNonce])
      delete this.invalidNonceTxs[address][targetNonce]
      this.applyInvalidNonceTxs(address)
    }
  }

  tick () {
    /*
     * In this sim we will not send random transactions
     *

    // If we have no money, don't do anything!
    if (this.state[this.wallet.address].balance < 10) {
      console.log('We are honest so we wont send anything :)')
      return
    }
    // Generate random transaction
    const tx = this.generateTx(nodes[Math.floor(Math.random() * nodes.length)].wallet.address, 10)
    this.transactions.push(tx)
    this.applyTransaction(tx)
    // Broadcast this tx to the network
    this.network.broadcast(this.pid, tx)
    */
  }

  getState() {

    for (let i = 0; i < this.allBlocks.length; i++) {
      if (this.blockchain.includes(this.allBlocks[i])) {
        this.allBlocks.pop(this.allBlocks[i])
      } else {
        if (this.allBlocks[i].parentHash === getHash(this.blockchain.slice(-1)[0])) {
          this.blockchain.push(this.allBlocks[i])
        }
      }
    }

    // this.state = {} //RESET STATE
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

class Miner extends Client {
  onReceive (message) {
    if (message.contents.type === 'send') {
      if (this.transactions.includes(message)) {
        return
      }
      this.transactions.push(message)      //add tx to mempool
      this.applyTransaction(message)       //update state
      this.applyInvalidNonceTxs(message.contents.from) //update state
      let newBlock = this.mineBlock(message)  //mine a block with the tx

      if (newBlock === 'FAIL') {
        console.log("no valid block found, giving up")
      } else {
        this.blockchain.push(newBlock) //add to own blockchain
        this.network.broadcast(this.pid, newBlock) //broadcast new block to network
      }
    } else if (message.contents.type === 'block') {
      if (message.parentHash === getHash(this.blockchain.slice(-1)[0])) {
        this.allBlocks.push(message)      //add block to all blocks received
        this.getState() //check if block should go to own blockchain
      } else {
        this.allBlocks.push(message)
      }
      this.getState() // fork choice + updates state only with tx from longest chain
    }
  }

  mineBlock (tx) {
    let difficulty = 3
    let maxAttempts = 100000
    let timestamp = Math.round(new Date().getTime() / 1000)

    const newBlock = {
      coinbase: this.wallet.address,
      difficulty: difficulty,
      parentHash: getHash(this.blockchain.slice(-1)[0]),
      timestamp: timestamp,
      contents: {
        type: 'block',
        txList: [tx]
      }
    }

    // Proof of work on the blocks
    // Add anti-spam protection with proof of work on each block
    for (let i = 0; i < maxAttempts; i++) {
      let blockAttempt = Object.assign({'nonce': i}, newBlock)
      let blockHash = getHash(blockAttempt)
      if (parseInt(blockHash.substring(0, 2 + difficulty)) === 0) {
        return blockAttempt
      }
    }
    return 'FAIL'
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
  nodes.push(new Miner(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  network.connectPeer(nodes[i], 3)
}

nodes[0].generateTx(nodes[1].wallet.address, 10)
for (let i = 0; i < 800; i++) {
  network.tick()
}
nodes[0].generateTx(nodes[2].wallet.address, 5)
for (let i = 0; i < 800; i++) {
  network.tick()
}
nodes[1].generateTx(nodes[2].wallet.address, 5)
for (let i = 0; i < 800; i++) {
  network.tick()
}


for (let i = 0; i < numNodes; i++) {
  console.log('node: ', nodes[i].p2pNodeId.address)
  console.log('chain len', nodes[i].blockchain.length)
  for (let j = 0; j < nodes[i].blockchain.length; j++) {
    console.log('block parentHash', nodes[i].blockchain[j].parentHash)
  }
  console.log('node state: ', nodes[i].state)
}
