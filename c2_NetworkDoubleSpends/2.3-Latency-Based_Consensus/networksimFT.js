var EthCrypto = require('eth-crypto')
var NetworkSimulator = require('../networksim')

class NetworkSimFT extends NetworkSimulator {
  constructor (latency, packetLoss) {
   super(latency, packetLoss)
  }

  tick () {
   // call NetworkSimulator tick()
   super.tick()
   console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~time: ' + this.time + '~~~~~~~~~~~~~~~~~~~~~~~~')
   for (let i = 0; i < this.agents.length; i++) {
     console.log('~~~~~~~~~ Node', i, '~~~~~~~~~')
     console.log(this.agents[i].state)
     if(JSON.stringify(this.agents[i].state) !== JSON.stringify(this.agents[0].state))
      throw new Error('Nodes have fallen out of consensus')
   }
  }
}

module.exports = NetworkSimFT
