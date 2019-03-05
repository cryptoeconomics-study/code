var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')
var {Node, getTxHash} = require('../nodeAgent')
var _ = require('lodash')

// Spender is a Node that sends a random transaction at every tick()
class PoA extends Node {
  constructor (wallet, genesis, network, authority) {
    super(wallet, genesis, network)
    this.authority = authority //Eth Address of the authority node
  }
  onReceive(tx) {
    //Check authority signature
    //Check sender signature

    this.network.broadcast(this.pid, tx)
  }
}

module.exports = FaultTolerant
