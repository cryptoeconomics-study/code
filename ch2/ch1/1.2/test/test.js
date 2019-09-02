const EthCrypto = require('eth-crypto');
const assert = require('assert');
const Client = require('../client.js');
const Paypal = require('../paypal.js');

// Test The Client
describe('Client Tests', () => {
  // Test Transaction Generation
  describe('Generate Transactions', () => {
    // init params
    const alice = new Client();
    const bob = new Client();
    let tx;
    let unsignedTx;
    // run the tests
    beforeEach(() => {
      tx = alice.generateTx(bob.wallet.address, 10, 'send');
    });
    it('should properly set contents', () => {
      unsignedTx = {
        type: 'send',
        amount: 10,
        from: alice.wallet.address,
        to: bob.wallet.address,
      };
      assert.deepEqual(tx.contents, unsignedTx);
    });
    it('should properly sign the contents', () => {
      const sig = alice.sign(unsignedTx);
      assert.equal(tx.sig, sig);
    });
  });
});

// Test Paypal
describe('Paypal Tests', () => {
  // Test Contructor
  describe('Constructor', () => {
    // init params
    const paypal = new Paypal();
    const genesis = {
      [paypal.wallet.address]: {
        balance: 1000000,
      },
    };
    // run the tests
    it('should properly set this.state', () => {
      assert.deepEqual(paypal.state, genesis);
    });
    it('should properly set this.txHistory', () => {
      assert.deepEqual(paypal.txHistory, []);
    });
  });

  // Test Transaction Signature Check
  describe('Transaction Signature Check', () => {
    // init params
    const paypal = new Paypal();
    const alice = new Client();
    const bob = new Client();
    const aliceUnsignedTx = {
      type: 'send',
      amount: 10,
      from: alice.wallet.address,
      to: bob.wallet.address,
    };
    const invalidTx = {
      contents: aliceUnsignedTx,
      sig: bob.sign(aliceUnsignedTx),
    };
    const validTx = {
      contents: aliceUnsignedTx,
      sig: alice.sign(aliceUnsignedTx),
    };
    // run the tests
    it('should fail because the sender is not Alice', () => {
      assert.equal(false, paypal.checkTxSignature(invalidTx));
    });
    it('should pass if the sender and signer are the same', () => {
      assert.equal(true, paypal.checkTxSignature(validTx));
    });
  });

  // Test User Address Check
  describe('User Address Check', () => {
    // init params
    const paypal = new Paypal();
    const bob = new Client();
    const alice = new Client();
    const aliceTx = alice.generateTx(bob.wallet.address, 10, 'send');
    // run the tests
    it('should pass even though Alice is not already in the newly created Paypal state', () => {
      assert.equal(true, paypal.checkUserAddress(aliceTx));
    });
    it("Alice's address should have a 0 balance in the paypal state", () => {
      assert.equal(0, paypal.state[alice.wallet.address].balance);
    });
  });

  // Test TX Check
  describe('TX Check', () => {
    // init params
    const paypal = new Paypal();
    const bob = new Client();
    const alice = new Client();
    // run the tests
    it('should return false because Alice has a balance of 0 with Paypal, but the transaction amount is 10', () => {
      const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send');
      // we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
      paypal.checkUserAddress(aliceTx2Bob);
      assert.equal(false, paypal.checkTxType(aliceTx2Bob));
    });
    it('should return false because Alice is just checking her balance and true would move her transaction through to processing in the state transition function', () => {
      const aliceBalanceCheck = alice.generateTx(
        paypal.wallet.address,
        0,
        'check',
      );
      assert.equal(false, paypal.checkTxType(aliceBalanceCheck));
    });
    it('should return true because this is a test to test the tests', () => {
      assert.equal(true, true);
    });
    it('should return false because Alice is not authorized to mint tokens on the Paypal network', () => {
      const invalidMint = alice.generateTx(alice.wallet.address, 1000, 'mint');
      assert.equal(false, paypal.checkTxType(invalidMint));
    });
    it('should return true because Paypal is authorized to mint tokens on their own network', () => {
      const validMint = paypal.generateTx(paypal.wallet.address, 1000, 'mint');
      assert.equal(true, paypal.checkTxType(validMint));
    });
  });

  // Test Transaction Processing
  describe('Applying Transactions', () => {
    // init params
    const paypal = new Paypal();
    const alice = new Client();
    const bob = new Client();
    // run the tests
    it('should return true because the applyTx() function assumes that any tx it receives is valid', () => {
      const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send');
      // we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
      paypal.checkUserAddress(aliceTx2Bob);
      assert.equal(true, paypal.applyTx(aliceTx2Bob));
    });
    it('should return true because the applyTx() function assumes that any tx it receives is valid', () => {
      const aliceTx2Alice = alice.generateTx(alice.wallet.address, 10, 'send');
      // we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
      paypal.checkUserAddress(aliceTx2Alice);
      assert.equal(true, paypal.applyTx(aliceTx2Alice));
    });
  });

  // Test State Transition Function
  describe('checkTx and processTx', () => {
    // init params
    const paypal = new Paypal();
    const alice = new Client();
    const bob = new Client();
    const aliceUnsignedTx = {
      type: 'send',
      amount: 10,
      from: alice.wallet.address,
      to: bob.wallet.address,
    };
    const invalidTx = {
      contents: aliceUnsignedTx,
      sig: bob.sign(aliceUnsignedTx),
    };
    // run the tests
    it('should return false because the sender is not Alice', () => {
      assert.equal(false, paypal.checkTx(invalidTx));
    });
    it('should return false because Alice has a balance of 0 with Paypal, but the transaction amount is 10', () => {
      const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send');
      assert.equal(false, paypal.checkTx(aliceTx2Bob));
    });
    it('should return true because Paypal is authorized to mind tokens on their own network', () => {
      const validMint = paypal.generateTx(paypal.wallet.address, 1000, 'mint');
      assert.equal(true, paypal.checkTx(validMint));
    });
    it('should return true because Paypal is minting tokens for Alice to spend, adding Alice and Bob to the state, and Alice is creating a valid transaction to Bob', () => {
      const validMint = paypal.generateTx(alice.wallet.address, 1000, 'mint');
      paypal.processTx(validMint);
      const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send');
      assert.equal(true, paypal.checkTx(aliceTx2Bob));
    });
    it('should return true because Paypal is minting tokens for Alice to spend, adding Alice and Bob to the state, and Alice is creating a valid transaction to send tokens to Bob', () => {
      const validMint = paypal.generateTx(alice.wallet.address, 1000, 'mint');
      paypal.processTx(validMint);
      const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send');
      paypal.processTx(aliceTx2Bob);
      assert.equal(10, paypal.state[bob.wallet.address].balance);
    });
  });
});
