var EthCrypto = require('eth-crypto')
var hexToBinary = require('hex-to-binary')
var {Node, getTxHash} = require('../nodeAgent')

const genesisBlock = {
  nonce: 0,
  number: 0,
  coinbase: 0,
  difficulty: 1337,
  parentHash: 0,
  timestamp: 0,
  contents: {
    type: 'block',
    txList: []
  }
}

while(true) {
  const blockHash = getTxHash(genesisBlock)
  if(blockHash.substring(2,6)=== 'c0de') {
    console.log(genesisBlock)
    break;
  }
  genesisBlock.nonce++
}
