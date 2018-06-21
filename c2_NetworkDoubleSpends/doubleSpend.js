var EthCrypto = require('eth-crypto')
var network = require('./networksim')()

function getTxHash (tx) {
  return EthCrypto.hash.keccak256(JSON.stringify(tx))
}

// class InvalidNonce extends Error {
//   constructor (...args) {
//     super(...args)
//     Error.captureStackTrace(this, InvalidNonce)
//   }
// }

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
    if (this.transactions.includes(tx)) {
      return
    }
    this.transactions.push(tx)
    this.applyTransaction(tx)
    this.network.broadcast(this.pid, tx)
    this.applyInvalidNonceTxs(tx.contents.from)
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

  generateTx (to, amount) {
    const unsignedTx = {
      type: 'send',
      amount: amount,
      from: this.wallet.address,
      to: to,
      nonce: this.state[this.wallet.address].nonce
    }
    // console.log(unsignedTx)
    const tx = {
      contents: unsignedTx,
      sig: EthCrypto.sign(this.wallet.privateKey, getTxHash(unsignedTx))
    }
    return tx
  }

  applyTransaction (tx) {
    // Check the from address matches the signature
    const signer = EthCrypto.recover(tx.sig, getTxHash(tx.contents))
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
  nodes.push(new Node(wallets[i], JSON.parse(JSON.stringify(genesis)), network))
  // Connect everyone to everyone
  network.connectPeer(nodes[i], 3)
}

// Attempt double spend
const evilNode = nodes[0]
const victims = [network.peers[evilNode.pid][0], network.peers[evilNode.pid][1]]
const spends = [evilNode.generateTx(victims[0].wallet.address, 100), evilNode.generateTx(victims[1].wallet.address, 100)]
network.broadcastTo(evilNode.pid, victims[0], spends[0])
network.broadcastTo(evilNode.pid, victims[1], spends[1])
// Now run the network until an invalid spend is detected.
// We will also detect if the two victim nodes, for a short time, both believe they have been sent money
// by our evil node. That's our double spend!
for (let i = 0; i < 800; i++) {
  network.tick()
  let victimBalances = []
  for (let v of victims) {
    victimBalances.push([v.state[evilNode.wallet.address].balance, v.state[v.wallet.address].balance])
    console.log('Victim ' + victimBalances.length + ' has balance ' + victimBalances[victimBalances.length - 1][1])
    if (Object.keys(v.invalidNonceTxs).length > 0) {
      console.log('Double spend propagated to victim ' + victimBalances.length)
      throw (new Error('Double spend was successful!'))
    }
  }
  if (victimBalances[0][1] === 100 && victimBalances[1][1] === 100) {
    console.log('Double spend detected!!!!! Ahh!!!')
  }
}
console.log('Looks like the double spend was foiled by network latency! Victim 1 or 2 propegated their transaction ' +
  'to the other victim before the double spend was received!')
