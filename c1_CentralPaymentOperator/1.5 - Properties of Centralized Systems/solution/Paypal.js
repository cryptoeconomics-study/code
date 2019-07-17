const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')

class Paypal extends Client {
  constructor() {
    super()
    this.state = {
      [this.wallet.address]: {
        balance: 0,
        nonce: 0
      }
    }
    this.transactions = []
    this.invalidNonceTxs = {}
    this.blacklist = []
  }

  stealAllFunds() {
    let sum = 0
    for (let address in this.state) {
      if (this.state[address]!==this.wallet.address) {
        sum += this.state[address].balance
        this.state[address].balance = 0
      }
    }
    this.state[this.wallet.address].balance += sum
  }

  onReceive(tx) {
    this.applyTransaction(tx)
    this.applyInvalidNonceTxs(tx.contents.from)
  }

  applyInvalidNonceTxs(address) {
    const targetNonce = this.state[address].nonce
    if (address in this.invalidNonceTxs &&
      targetNonce in this.invalidNonceTxs[address]) {
      this.applyTransaction(this.invalidNonceTxs[address][targetNonce])
      delete this.invalidNonceTxs[address][targetNonce]
      this.applyInvalidNonceTxs(address)
    }
  }

  applyTransaction(tx) {
    if(this.blacklist.includes(tx.contents.from)) {
      throw new Error('Blacklisted Address')
    }
    // verify the signature
    const validSig = this.verify(
      tx.sig,
      this.toHash(tx.contents),
      tx.contents.from
    )
    if (!validSig) {
      throw new Error('Invalid signature!')
    }
    // Check that the nonce is correct for replay protection
    if (tx.contents.nonce > this.state[tx.contents.from].nonce) {
      if (!(tx.contents.from in this.invalidNonceTxs)) {
        this.invalidNonceTxs[tx.contents.from] = {}
      }
      this.invalidNonceTxs[tx.contents.from][tx.contents.nonce] = tx
      return
    } else if (tx.contents.nonce < this.state[tx.contents.from].nonce) {
      return
    }
    // If we don't have a record for this address, create one
    if (!(tx.contents.to in this.state)) {
      this.state[tx.contents.to] = {
        balance: 0,
        nonce: 0
      }
    }
    // Mint coins **only if identity is PayPal**
    if (tx.contents.type === 'mint') {
      if (tx.contents.from !== this.wallet.address) {
        throw new Error('Non-Paypal Clients can\'t mint!')
      }
      this.state[tx.contents.to].balance += tx.contents.amount
    } else if (tx.contents.type === 'send') { // Send coins
      if (this.state[tx.contents.from].balance - tx.contents.amount < 0) {
        throw new Error('Not enough money!')
      }
      if (Object.keys(this.state).length >= 100) {
        if (this.state[tx.contents.from].balance - tx.contents.amount < 1) {
          throw new Error('Not enough money!')
        }
        this.state[tx.contents.from].balance -= 1
        this.state[this.wallet.address].balance += 1
      }
      this.state[tx.contents.from].balance -= tx.contents.amount
      this.state[tx.contents.to].balance += tx.contents.amount
    }
    this.state[tx.contents.from].nonce += 1
  }
}
module.exports = Paypal;
