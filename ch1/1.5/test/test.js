const Client = require("../Client.js");
const Paypal = require("../Paypal.js");
const EthCrypto = require("eth-crypto");
const assert = require("assert");

describe("Rent Extraction", function() {
  let paypal = new Paypal();
  let alice = new Client();
  let bob = new Client();
  const tx1 = paypal.generateTx(alice.wallet.address, 100, "mint"),
    tx2 = alice.generateTx(bob.wallet.address, 10, "send"),
    tx3 = alice.generateTx(bob.wallet.address, 10, "send");
  it("should not extract rent under 100 users", function() {
    paypal.onReceive(tx1);
    paypal.onReceive(tx2);
    assert.deepEqual(paypal.state, {
      [alice.wallet.address]: {
        balance: 90,
        nonce: 1
      },
      [paypal.wallet.address]: {
        balance: 0,
        nonce: 1
      },
      [bob.wallet.address]: {
        balance: 10,
        nonce: 0
      }
    });
  });
  it("should extract $1 fees when over 100 users", function() {
    for (let i = 0; i <= 100; i++) {
      paypal.state["0x" + i] = {balance: 0, nonce: 0};
    }
    paypal.onReceive(tx3);
    assert.deepEqual(paypal.state[alice.wallet.address], {
      balance: 79,
      nonce: 2
    });
    assert.deepEqual(paypal.state[paypal.wallet.address], {
      balance: 1,
      nonce: 1
    });
  });
});

describe("Censorship", function() {
  let paypal = new Paypal();
  let alice = new Client();
  let bob = new Client();
  const tx1 = paypal.generateTx(alice.wallet.address, 100, "mint"),
    tx2 = alice.generateTx(bob.wallet.address, 10, "send"),
    tx3 = alice.generateTx(bob.wallet.address, 10, "send");
  it("should allow transactions from non-blacklisted addresses", function() {
    paypal.onReceive(tx1);
    paypal.onReceive(tx2);
    assert.deepEqual(paypal.state, {
      [alice.wallet.address]: {
        balance: 90,
        nonce: 1
      },
      [paypal.wallet.address]: {
        balance: 0,
        nonce: 1
      },
      [bob.wallet.address]: {
        balance: 10,
        nonce: 0
      }
    });
  });
  it("should throw Error if tx is from blacklisted address", function() {
    paypal.blacklist.push(alice.wallet.address);
    assert.throws(() => {
      paypal.onReceive(tx3);
    }, Error);
  });
});

describe("Steal All Funds Fraud", function() {
  let paypal = new Paypal();
  let alice = new Client();
  let bob = new Client();
  const tx1 = paypal.generateTx(alice.wallet.address, 100, "mint"),
    tx2 = alice.generateTx(bob.wallet.address, 30, "send");
  it("should steal all funds", function() {
    paypal.onReceive(tx1);
    paypal.onReceive(tx2);
    paypal.stealAllFunds();
    assert.deepEqual(paypal.state, {
      [alice.wallet.address]: {
        balance: 0,
        nonce: 1
      },
      [paypal.wallet.address]: {
        balance: 100,
        nonce: 1
      },
      [bob.wallet.address]: {
        balance: 0,
        nonce: 0
      }
    });
  });
});
