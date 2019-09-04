const EthCrypto = require('eth-crypto');
const hexToBinary = require('hex-to-binary');
const { Node, getTxHash } = require('../nodeAgent');

// test the PoWClient
describe('PoWClient Tests', () => {
  // testing onReceive() to process incoming messages
  // testing receeiveTx() to process incoming transactions
  // testing receiveBlock() to process incoming blocks
  // - testing isValidBlockHash() to check the hash of the block meets the network's difficulty requirements
  // - testing applyBlock() to process a block and update the state
  // testing updateState() to choose the longest chain
});
