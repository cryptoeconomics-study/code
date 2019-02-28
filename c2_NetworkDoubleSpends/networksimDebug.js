var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('./networksim')

class NetworkSimDebug extends NetworkSimulator {
 constructor (latency, packetLoss) {
   super(latency, packetLoss)
 }

 tick () {
     if(this.time === 67) {
         console.log('')
     }
   // call NetworkSimulator tick()
   super.tick()
   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~time: ' + this.time + '~~~~~~~~~~~~~~~~~~~~~~~~')
   console.log('msgs: ',  this.messageQueue)
   for (let i = 0; i < this.agents.length; i++) {
     console.log('~~~~~~~~~ Node', i, '~~~~~~~~~')
     console.log(this.agents[i].pendingTxs)
   }
 }
}

module.exports = NetworkSimDebug
