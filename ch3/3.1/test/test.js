const EthCrypto = require('eth-crypto');
const hexToBinary = require('hex-to-binary');
const Client = require('PoWClient');
const { Node, getTxHash } = require('../nodeAgent');

// test the PoWClient
describe('PoWClient Tests', () => {
  // testing onReceive() to process incoming messages
  describe('onReceive()', () => {
    it('should run receiveTx() because the message is a transaction', () => {
      const testingClient = new Client();
      const message = 'tbd';
      assert.equal(true, testingClient.receiveTx(message));
    });
  });
  // testing receiveTx() to process incoming transactions
  describe('receiveTx()', () => {});
  // testing receiveBlock() to process incoming blocks
  describe('receiveBlock()', () => {
    // testing isValidBlockHash() to check the hash of the block meets the network's difficulty requirements
    describe('isValidBlockHash()', () => {});
    // testing applyBlock() to process a block and update the state
    describe('applyBlock()', () => {});
  });
  // testing updateState() to choose the longest chain
  describe('updateState()', () => {});
});
