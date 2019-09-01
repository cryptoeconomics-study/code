const EthCrypto = require('eth-crypto');
const assert = require('assert');
const Client = require('../client.js');

// Test The Client
describe('Client Tests', () => {
  // Testing hash() function to hash random data
  describe('Hash', () => {
    const data = Math.random();
    const client = new Client();
    const output = client.hash(data);
    it('should return the hash of data', () => {
      assert.equal(EthCrypto.hash.keccak256(data), output);
    });
  });

  // Testing constructor() to initialize this.wallet with EthCrypto.createIdentity()
  describe('Wallet', () => {
    const client = new Client();
    const { wallet } = client;
    it('should set this.wallet', () => {
      assert(wallet);
    });
    it('should set this.wallet using createIdentity()', () => {
      assert(wallet.address && wallet.publicKey && wallet.privateKey);
    });
  });

  // Testing sign() function to use this.wallet to sign random data
  describe('Digital Signatures', () => {
    const client = new Client();
    const message = Math.random();
    const signature = EthCrypto.sign(
      client.wallet.privateKey,
      EthCrypto.hash.keccak256(message),
    );
    it('should set successfully sign messages', () => {
      assert.equal(client.sign(message), signature);
    });
  });

  // Testing verify() to check signatures from randomly initialized  wallets
  describe('Verify Signatures', () => {
    let Alice;
    let Bob;
    let Kevin;
    let message;
    let signature;
    beforeEach(() => {
      message = Math.random();
      Alice = new Client();
      Bob = new Client();
      Kevin = new Client();
      signature = Alice.sign(message);
    });
    it('should be considered valid', () => {
      assert(
        Kevin.verify(
          signature,
          EthCrypto.hash.keccak256(message),
          Alice.wallet.address,
        ),
      );
    });
    it('should be considered invalid', () => {
      assert(
        !Kevin.verify(
          signature,
          EthCrypto.hash.keccak256(message),
          Bob.wallet.address,
        ),
      );
    });
  });
});
