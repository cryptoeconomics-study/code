var EthCrypto = require('eth-crypto')
var network = require('./networksim')()

/*
 * Example Transactions

var unsignedTxs = [
  {
    type: 'mint',
    amount: 100,
    from: nodes.paypal.address,
    to: nodes.paypal.address,
    nonce: 0
  },
  {
    type: 'send',
    amount: 65,
    from: nodes.paypal.address,
    to: nodes.aparna.address,
    nonce: 1
  },
  {
    type: 'send',
    amount: 10,
    from: nodes.aparna.address,
    to: nodes.jing.address,
    nonce: 0
  }
]

var signedTxs = [
  {
    contents: unsignedTxs[0],
    sig: EthCrypto.sign(nodes.paypal.privateKey, getTxHash(unsignedTxs[0]))
  },
  {
    contents: unsignedTxs[1],
    sig: EthCrypto.sign(nodes.paypal.privateKey, getTxHash(unsignedTxs[1]))
  },
  {
    contents: unsignedTxs[2],
    sig: EthCrypto.sign(nodes.aparna.privateKey, getTxHash(unsignedTxs[2]))
  }
]
*/

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

class InvalidNonce extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, InvalidNonce)
  }
}

function applyTransaction (state, tx) {
  // Check the from address matches the signature
  const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents))
  if (signer !== tx.contents.from) {
    throw new Error('Invalid signature!')
  }
  // If we don't have a record for this address, create one
  if (!(tx.contents.to in state)) {
    state[[tx.contents.to]] = {
      balance: 0,
      nonce: -1
    }
  }
  // Check that the nonce is correct for replay protection
  if (tx.contents.nonce !== state[[tx.contents.from]].nonce + 1) {
    throw new InvalidNonce(tx)
  }
  // Mint coins **only if identity is PayPal**
  if (tx.contents.type === 'send') { // Send coins
    if (state[[tx.contents.from]].balance - tx.contents.amount < 0) {
      throw new Error('Not enough money!')
    }
    state[[tx.contents.from]].balance -= tx.contents.amount
    state[[tx.contents.to]].balance += tx.contents.amount
  } else {
    throw new Error('Invalid transaction type!')
  }
  state[[tx.contents.from]].nonce += 1
}

class Node {
  constructor (wallet, genesis, network) {
    // Blockchain identity
    this.wallet = wallet
    // P2P Node identity -- used for connecting to peers
    this.p2pNodeId = EthCrypto.createIdentity()
    this.pid = this.p2pNodeId.address
    this.network = network
    this.state = genesis
    this.transactions = []
    this.invalidNonceTxs = {}
  }

  onReceive (tx) {
    if (!this.transactions.includes(tx)) {
      this.transactions.push(tx)
      this.network.broadcast(this.pid, tx)
    }
    try {
      applyTransaction(this.state, tx)
    } catch (e) {
      // Catch invalid nonce
      if (!(e instanceof InvalidNonce)) {
        throw e
      }
      // Add transaction to invalidNonceTxs
      if (!(tx.contents.from in this.invalidNonceTxs)) {
        this.invalidNonceTxs[tx.contents.from] = {}
      }
      this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx
    }
    this.applyInvalidNonceTxs(tx.contents.from)
  }

  applyInvalidNonceTxs (address) {
    const targetNonce = this.state[address].nonce + 1
    if (address in this.invalidNonceTxs && targetNonce in this.invalidNonceTxs[address]) {
      applyTransaction(this.state, this.invalidNonceTxs[address][targetNonce])
      if (targetNonce > 3 && '2' in this.invalidNonceTxs[address]) {
        console.log('my adddress:', address)
        console.log("Deleting:", this.invalidNonceTxs[address][targetNonce])
        console.log('~~~~~~~Transactions~~~~~~')
        console.log(this.transactions)
        console.log('~~~~~~~Invalid nonce txs~~~~~~')
        console.log(this.invalidNonceTxs[address])
        throw 'WTF'
      }
      delete this.invalidNonceTxs[address][targetNonce]
      this.applyInvalidNonceTxs(address)
    }
  }

  tick () {
    // Generate random transaction
    const unsignedTx = {
      type: 'send',
      amount: 1,
      from: this.wallet.address,
      to: nodes[Math.floor(Math.random() * nodes.length)].wallet.address,
      nonce: this.state[this.wallet.address].nonce + 1
    }
    const tx = {
      contents: unsignedTx,
      sig: EthCrypto.sign(this.wallet.privateKey, getTxHash(unsignedTx))
    }
    this.transactions.push(tx)
    applyTransaction(this.state, tx)
    // Broadcast this tx to the network
    this.network.broadcast(this.pid, tx)
  }
}

// ****** Test this out using a simulated network ****** //
const numNodes = 5
const wallets = []
const genesis = {}
for (let i = 0; i < numNodes; i++) {
  // Create new identity
  wallets.push(EthCrypto.createIdentity())
  // Add that node to our genesis block & give them an allocation
  genesis[wallets[i].address] = {
    balance: 100,
    nonce: 0
  }
}
const nodes = []
// Create new nodes based on our wallets, and connect them to the network
for (let i = 0; i < numNodes; i++) {
  nodes.push(new Node(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  network.connectPeer(nodes[i], 2)
}

network.run(30)

console.log('~~~~~~~~~~~ Node 0 ~~~~~~~~~~~')
console.log(nodes[0].state)
console.log('~~~~~~~~~~~ Node 1 ~~~~~~~~~~~')
console.log(nodes[1].state)
console.log('~~~~~~~~~~~ Node 1 ~~~~~~~~~~~')
console.log(nodes[1].invalidNonceTxs)

// for (tx of nodes[1].transactions) {
//   if (tx.contents.from == nodes[2].wallet.address) {
//     console.log(tx)
//   }
// }

// console.log(nodes[1].transactions)
// for (key in nodes[1].invalidNonceTxs) {
//   console.log(nodes[1].invalidNonceTxs[key].contents)
// }

// function visualizeNetwork (network) {
//   // Press "Execute" to run your program
//   var Graph = require('p2p-graph')

//   var graph = new Graph('.root')

//   // select event
//   graph.on('select', function (id) {
//     console.log(id + ' selected!')
//   })

//   for (let i = 0; i < nodes.length; i++) {
//     // add peers
//     graph.add({
//       id: nodes[i].pid,
//       name: nodes[i].pid.slice(0, 10)
//     })
//   }
//   for (const node of nodes) {
//     // connect them
//     for (const peer of network.peers[node.pid]) {
//       graph.connect(node.pid, peer.pid)
//     }
//   }
// }
