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
    this.allBlocks = []    //all blocks
    this.invalidNonceTxs = {}
    this.head = 0 //keep track of highest block number added received

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
        console.log('not enough money...yet')
        return
      }
      // Check that the nonce is correct for replay protection
      if (tx.contents.nonce !== this.state[[tx.contents.from]].nonce) {
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

  // Fork choice
  // Only apply transactions which are contained in the longest chain
  // and returns the resulting state object.
  getState() {
    //a temp chain
    let tempChain = []
    //a temp store of tempChain[lastblock].parentHash
    let prevHash = 0
    //return highest block number (ie, head) from allBlocks
    let max = Math.max.apply(Math, this.allBlocks.map(function(block) { return block.number; }))
    let allBlocks = this.allBlocks
    //add head to tempChain
    Object.keys(allBlocks).filter(function(block) {
      if (allBlocks[block].number === max) {
        //should only add one block. push the first one by position in allBlocks array
        if (tempChain.length === 0) {
          tempChain.push(allBlocks[block])
        //if there are two or more blocks with "max" as block number
        } else {
          //compare difficulty and store from the one with most work
          if (allBlocks[block].difficulty > tempChain[0].difficulty) {
            tempChain.pop()
            tempChain.push(allBlocks[block])
          }
        }
      }
    })
    //look for up to "max" number of blocks to add to tempChain using parentHash
    for (let i = tempChain.length; i < max; i++) {
      Object.keys(allBlocks).filter(function(block) {
        prevHash = tempChain[tempChain.length -1].parentHash
        if (getHash(allBlocks[block]) === prevHash) {
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


class Miner extends Client {
  onReceive (message) {
    if (message.contents.type === 'send') {
      if (this.transactions.includes(message)) {
        return
      }
      this.transactions.push(message)      //add tx to mempool
      this.applyTransaction(message)       //update state
      this.applyInvalidNonceTxs(message.contents.from) //update state
      let newBlock = this.mineBlock(message)
      if (newBlock === 'FAIL') {
        console.log("no valid block found, giving up")
      } else {
        this.blockchain.push(newBlock) //add to own blockchain
        this.allBlocks.push(newBlock) //add to allBlocks
        this.network.broadcast(this.pid, newBlock) //broadcast new block to network
      }

    } else if (message.contents.type === 'block') {
      if (message.parentHash === getHash(this.blockchain.slice(-1)[0])) {
        this.head = message.number
        this.blockchain.push(message)      //add block to own blockchain
        this.allBlocks.push(message)      //add block to all blocks received
      } else {
        this.allBlocks.push(message)
      }
    }
  }

  mineBlock (tx) {
    //returns an integer between 3 and 4 so we can have blocks with
    //different difficulties for fork choice (MDN example)
    let difficulty = Math.floor(Math.random() * (4 - 3 + 1)) + 3
    // let difficulty = 3 //for faster execution
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
    //   sig: EthCrypto.sign(this.wallet.privateKey, getHash(unsignedTx))
    // }

    const newBlock = {
      number: this.blockchain.slice(-1)[0].number + 1, // follow local version of the longest chain
      coinbase: this.wallet.address,
      difficulty: difficulty,
      parentHash: getHash(this.blockchain.slice(-1)[0]),
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
nodes[0].generateTx(nodes[3].wallet.address, 5)
for (let i = 0; i < 800; i++) {
  network.tick()
}
nodes[1].generateTx(nodes[4].wallet.address, 5)
for (let i = 0; i < 800; i++) {
  network.tick()
}


for (let i = 0; i < numNodes; i++) {
  console.log('node: ', nodes[i].p2pNodeId.address)
  // console.log('my chain',nodes[i].blockchain)
  // console.log('all blocks',nodes[i].allBlocks)
  console.log('chain len', nodes[i].blockchain.length)
  // for (let j = 0; j < nodes[i].blockchain.length; j++) {
    // console.log('block number', nodes[i].blockchain[j].number)
    // console.log('block parentHash', nodes[i].blockchain[j].parentHash)
  // }
  console.log('node state: ', nodes[i].state)
  // console.log('invalidNonceTxs: ', nodes[i].invalidNonceTxs)
  console.log('xxxxxxxxx0xxxxxxxxx')
  //form the longest accumulated difficulty chain locally and update state
  nodes[i].getState()
  console.log('new node state: ', nodes[i].state)
}
