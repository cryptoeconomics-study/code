const Client = require('../Client.js')
const Paypal = require('../Paypal.js';
const EthCrypto = require('eth-crypto')
const assert = require('assert')

// Test that the client can generate transactions that conform to the spec described
describe('Generate Transactions', function () {
    let alice = new Client(),
        bob = new Client,
        tx,
        unsignedTx
    beforeEach(() => {
        tx = alice.generateTx(bob.wallet.address, 10, 'send')
    })

    it('should properly set contents', function () {
        unsignedTx = {
            type: 'send',
            amount: 10,
            from: alice.wallet.address,
            to: bob.wallet.address,
        }
        assert.deepEqual(tx.contents, unsignedTx)
    });

    it('should properly sign the contents', function () {
        const sig = alice.sign(unsignedTx)
        assert.equal(tx.sig, sig)
    })
})

// Test that the centralized payments operator initializes a state with accounts/balances and transaction history
describe('Paypal Constructor', function () {
    const paypal = new Paypal()
    const genesis = {
        [paypal.wallet.address]: {
            balance: 0
        }
    }
    it('should properly set this.state', function () {
        assert.deepEqual(paypal.state, genesis)
    });
    it('should properly set this.transactions', function () {
        assert.deepEqual(paypal.transactionHistory, [])
    })
})

// Test that the PayPal server can check transaction signatures 
describe('Check TX Signatures', function () {
    let paypal = new Paypal()
    let Alice = new Client()
    let Bob = new Client()
    const goodTx = Alice.generateTx(Bob.wallet.address, 35, 'send')
    const badTx = Alice.generateTx(Bob.wallet.address, 150, 'send')

    it('should check that the tx signer is the tx sender', function () {
        paypal.applyTransaction(goodTx)
        assert.deepEqual(paypal.state, {
            [Alice.wallet.address]: {
                balance: 65
            },
            [Bob.wallet.address]: {
                balance: 35
            },
            [paypal.wallet.address]: {
                balance: 0
            }
        })
    });
    it('should throw Error for invalid signatures', function () {
        assert.throws(()=>{paypal.applyTransaction(badSigTx)}, Error)
    })
    it('should throw Error for insufficient balance', function () {
        assert.throws(() => { paypal.applyTransaction(badSendTx)}, Error)
    })
})

// 
describe('Apply Transactions', function () {
    let paypal = new Paypal()
    let Alice = new Client()
    let Bob = new Client()
    const mintTx = paypal.generateTx(Alice.wallet.address, 100, 'mint')
    const sendTx = Alice.generateTx(Bob.wallet.address, 35, 'send')
    const badMintTx = Alice.generateTx(Alice.wallet.address, 100, 'mint')
    const badSigTx = {
        contents: mintTx.contents,
        sig: Alice.sign(mintTx.contents)
    }
    const badSendTx = Alice.generateTx(Bob.wallet.address, 150, 'send')

    it('should properly apply "mint" transactions', function () {
        paypal.applyTransaction(mintTx)
        assert.deepEqual(paypal.state, {
            [Alice.wallet.address]: {
                balance: 100
            },
            [paypal.wallet.address]: {
                balance: 0
            }
        })
    });
    it('should properly apply "spend" transactions', function () {
        paypal.applyTransaction(sendTx)
        assert.deepEqual(paypal.state, {
            [Alice.wallet.address]: {
                balance: 65
            },
            [Bob.wallet.address]: {
                balance: 35
            },
            [paypal.wallet.address]: {
                balance: 0
            }
        })
    });
    it('should throw Error when trying to mint from non-Paypal address', function () {
        assert.throws(()=>{paypal.applyTransaction(badMintTx)}, Error)
    })
    it('should throw Error for invalid signatures', function () {
        assert.throws(()=>{paypal.applyTransaction(badSigTx)}, Error)
    })
    it('should throw Error for insufficient balance', function () {
        assert.throws(() => { paypal.applyTransaction(badSendTx)}, Error)
    })
})
