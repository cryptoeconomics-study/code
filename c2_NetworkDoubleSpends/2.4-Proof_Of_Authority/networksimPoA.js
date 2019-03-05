var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')

class NetworkSimPoA extends NetworkSimulator {
  constructor (latency, packetLoss) {
   super(latency, packetLoss)
  }

  tick () {
   super.tick()
   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~time: ' + this.time + '~~~~~~~~~~~~~~~~~~~~~~~~')
   for (let i = 0; i < this.agents.length; i++) {
     if(this.agents[i].constructor.name === "Authority") {
      console.log('~~~~~~~~~ AUTHORITY', '~~~~~~~~~')
     } else {
       console.log('~~~~~~~~~ Node', i, '~~~~~~~~~')
     }
     console.log(this.agents[i].state)
   }
  }
}

module.exports = NetworkSimPoA
