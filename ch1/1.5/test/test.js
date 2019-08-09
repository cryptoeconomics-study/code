const EthCrypto = require('eth-crypto');
const assert = require('assert');
// const Client = require('../Client.js');
// const Paypal = require('../Paypal.js');
const Client = require('../solution/Client.js');
const Paypal = require('../solution/Paypal.js');

// Testing Paypal's fee feature
describe('Rent Extraction', () => {
  // init params
  const paypal = new Paypal();
  const alice = new Client();
  const bob = new Client();
  const carol = new Client();
  const mintAliceTokens = paypal.generateTx(alice.wallet.address, 100, 'mint');
  paypal.processTx(mintAliceTokens);
  const tx1 = alice.generateTx(bob.wallet.address, 10, 'send');
  paypal.processTx(tx1);
  const tx2 = bob.generateTx(carol.wallet.address, 5, 'send');
  paypal.processTx(tx2);

  it('should extract $1 fees from users', () => {
    assert.equal(89, paypal.state[alice.wallet.address].balance);
    assert.equal(4, paypal.state[bob.wallet.address].balance);
  });
});

// Testing Paypal's blacklist feature
describe('Censorship', () => {
  // init params
  const paypal = new Paypal();
  const alice = new Client();
  const bob = new Client();
  const eve = new Client();
  paypal.blacklist.push(eve.wallet.address);
  const mintAliceTokens = paypal.generateTx(alice.wallet.address, 100, 'mint');
  paypal.processTx(mintAliceTokens);
  const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send');
  const aliceTx2Eve = alice.generateTx(eve.wallet.address, 10, 'send');
  console.log(paypal);
  // send a transaction to and from non-blacklisted accounts
  it('should allow transactions from non-blacklisted addresses', () => {
    assert.equal(true, paypal.processTx(aliceTx2Bob));
  });
  // try to send transaction to a blacklisted account
  it('should return false and not process the transaction if the tx is to or from blacklisted address', () => {
    assert.equal(false, paypal.processTx(aliceTx2Eve));
  });
});

// Testing Paypal's theft feature
describe('Steal All Funds Fraud', () => {
  // init params
  const paypal = new Paypal();
  const alice = new Client();
  const bob = new Client();
  const tx1 = paypal.generateTx(alice.wallet.address, 100, 'mint');
  const tx2 = alice.generateTx(bob.wallet.address, 30, 'send');
  // steal all funds
  it('should steal all funds', () => {
    paypal.processTx(tx1);
    paypal.processTx(tx2);
    paypal.stealAllFunds();
    assert.equal(0, paypal.state[alice.wallet.address].balance);
    assert.equal(0, paypal.state[bob.wallet.address].balance);
  });
});
