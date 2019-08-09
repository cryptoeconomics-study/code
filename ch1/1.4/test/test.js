const EthCrypto = require('eth-crypto');
const assert = require('assert');
const Client = require('../Client.js');
const Paypal = require('../UTXOPaypal.js');

describe('UTXO applyTransaction', () => {
  const paypal = new Paypal();
  const alice = new Client();
  const bob = new Client();
  const genesis = {
    txOutputs: [{ value: 1000, owner: paypal.wallet.address }],
    isSpent: [0],
  };
  paypal.state = genesis;
  const unsignedTxs = [
    {
      inputs: [0],
      outputs: [
        { value: 250, owner: alice.wallet.address },
        { value: 250, owner: bob.wallet.address },
        { value: 500, owner: paypal.wallet.address },
      ],
    },
    {
      inputs: [1, 2],
      outputs: [{ value: 500, owner: paypal.wallet.address }],
    },
    // bad transactions
    {
      inputs: [0],
      outputs: [
        { value: 250, owner: alice.wallet.address },
        { value: 250, owner: bob.wallet.address },
        { value: 600, owner: paypal.wallet.address },
      ],
    },
  ];
  const signedTxs = [
    {
      contents: unsignedTxs[0],
      sigs: [paypal.sign(unsignedTxs[0])],
    },
    {
      contents: unsignedTxs[1],
      sigs: [alice.sign(unsignedTxs[1]), bob.sign(unsignedTxs[1])],
    },
  ];
  it('should throw Error for TX with invalid sig', () => {
    const invalidSigTx = {
      contents: unsignedTxs[0],
      sigs: [alice.sign(unsignedTxs[0])],
    };
    assert.throws(() => {
      paypal.applyTransaction(invalidSigTx);
    }, Error);
  });
  it('should throw Error for TX with value of outputs !== value of inputs', () => {
    const invalidValueTx = {
      contents: unsignedTxs[2],
      sigs: [paypal.sign(unsignedTxs[2])],
    };
    assert.throws(() => {
      paypal.applyTransaction(invalidValueTx);
    }, Error);
  });
  it('should properly apply UTXO with one input and multiple outputs', () => {
    paypal.applyTransaction(signedTxs[0]);
    assert.deepEqual(paypal.state, {
      txOutputs: [
        { value: 1000, owner: paypal.wallet.address },
        { value: 250, owner: alice.wallet.address },
        { value: 250, owner: bob.wallet.address },
        { value: 500, owner: paypal.wallet.address },
      ],
      isSpent: [1, 0, 0, 0],
    });
  });
  it('should throw Error when trying to spend spent TXOs', () => {
    assert.throws(() => {
      paypal.applyTransaction(signedTxs[0]);
    }, Error);
  });
  it('should throw Error when only contains some of the required sigs', () => {
    const someSigsTx = {
      contents: unsignedTxs[1],
      sigs: [alice.sign(unsignedTxs[1])],
    };
    assert.throws(() => {
      paypal.applyTransaction(someSigsTx);
    }, Error);
  });
  it('should properly apply UTXO with multiple inputs and multiple outputs', () => {
    paypal.applyTransaction(signedTxs[1]);
    assert.deepEqual(paypal.state, {
      txOutputs: [
        { value: 1000, owner: paypal.wallet.address },
        { value: 250, owner: alice.wallet.address },
        { value: 250, owner: bob.wallet.address },
        { value: 500, owner: paypal.wallet.address },
        { value: 500, owner: paypal.wallet.address },
      ],
      isSpent: [1, 1, 1, 0, 0],
    });
  });
});
