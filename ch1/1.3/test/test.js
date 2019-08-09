const EthCrypto = require('eth-crypto');
const assert = require('assert');
// const Client = require('../Client.js');
// const Paypal = require('../Paypal.js');
const Client = require('../solution/Client.js');
const Paypal = require('../solution/Paypal.js');

describe('Functioning Nonces', () => {
  // init params
  const paypal = new Paypal();
  const alice = new Client();
  const bob = new Client();
  const tx1 = paypal.generateTx(alice.wallet.address, 100, 'mint');
  const tx2 = alice.generateTx(bob.wallet.address, 10, 'send');
  const tx3 = alice.generateTx(bob.wallet.address, 10, 'send');

  //  Generating Tx
  describe('generateTx in Client.js', () => {
    it('should properly set the first nonce with generateTx', () => {
      const unsignedTx = {
        type: 'send',
        amount: 10,
        from: alice.wallet.address,
        to: bob.wallet.address,
        nonce: 0,
      };
      assert.deepEqual(tx2.contents, unsignedTx);
      const sig = alice.sign(unsignedTx);
      assert.equal(tx2.sig, sig);
    });

    it('should properly increment the nonce with generateTx', () => {
      const unsignedTx = {
        type: 'send',
        amount: 10,
        from: alice.wallet.address,
        to: bob.wallet.address,
        nonce: 1,
      };
      assert.deepEqual(tx3.contents, unsignedTx);
      const sig = alice.sign(unsignedTx);
      assert.equal(tx3.sig, sig);
    });
  });

  // Processing Tx
  describe('processTx in Paypal.js', () => {
    it('should correctly set nonce of a new sender', () => {
      paypal.processTx(tx1);
      assert.deepEqual(paypal.state[paypal.wallet.address], {
        balance: 1000000 - tx1.contents.amount,
        nonce: 1,
      });
    });

    it('should correctly set nonce of a new receiver', () => {
      assert.deepEqual(paypal.state[alice.wallet.address], {
        balance: 100,
        nonce: 0,
      });
    });

    it('Paypal should not apply transactions with a nonce greater than the nonce Paypal has for that user', () => {
      paypal.processTx(tx3);
      assert.equal(false, paypal.processTx(tx3));
    });

    it('should apply valid nonce transactions', () => {
      const paypal = new Paypal();
      const alice = new Client();
      const bob = new Client();
      const tx1 = paypal.generateTx(alice.wallet.address, 100, 'mint');
      const tx2 = alice.generateTx(bob.wallet.address, 10, 'send');
      const tx3 = alice.generateTx(bob.wallet.address, 10, 'send');
      paypal.processTx(tx1);
      paypal.processTx(tx2);
      assert.equal(true, paypal.processTx(tx3));
    });

    it('should apply pending transactions when they are ready', () => {
      const paypal = new Paypal();
      const alice = new Client();
      const bob = new Client();
      const tx1 = paypal.generateTx(alice.wallet.address, 100, 'mint');
      const tx2 = alice.generateTx(bob.wallet.address, 10, 'send');
      const tx3 = alice.generateTx(bob.wallet.address, 10, 'send');
      paypal.processTx(tx3);
      paypal.processTx(tx2);
      assert.equal(true, paypal.processTx(tx1));
    });
  });
});
