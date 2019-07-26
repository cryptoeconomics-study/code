const Client = require('../Client.js')
const Paypal = require('../UTXOPaypal.js');
const EthCrypto = require('eth-crypto')
const assert = require('assert')


describe('UTXO applyTransaction', function () {
    let paypal = new Paypal()
    let alice = new Client()
    let bob = new Client()
    const genesis = {
        txOutputs: [{ value: 1000, owner: paypal.wallet.address }],
        isSpent: [0]
    }
    paypal.state = genesis
    const unsignedTxs = [
        {
            inputs: [0],
            outputs: [
                { value: 250, owner: alice.wallet.address },
                { value: 250, owner: bob.wallet.address },
                { value: 500, owner: paypal.wallet.address }
            ]
        },
        {
            inputs: [1, 2],
            outputs: [
                { value: 500, owner: paypal.wallet.address }
            ]
        },
        // bad transactions
        {
            inputs: [0],
            outputs: [
                { value: 250, owner: alice.wallet.address },
                { value: 250, owner: bob.wallet.address },
                { value: 600, owner: paypal.wallet.address }
            ]
        }
    ]
    var signedTxs = [
        {
            contents: unsignedTxs[0],
            sigs: [paypal.sign(unsignedTxs[0])]
        },
        {
            contents: unsignedTxs[1],
            sigs: [
                alice.sign(unsignedTxs[1]),
                bob.sign(unsignedTxs[1])
            ]
        }
    ]
    it('should throw Error for TX with invalid sig', function () {
        const invalidSigTx = {
            contents: unsignedTxs[0],
            sigs: [alice.sign(unsignedTxs[0])]
        }
        assert.throws(() => { paypal.applyTransaction(invalidSigTx) }, Error)
    });
    it('should throw Error for TX with value of outputs !== value of inputs', function () {
        const invalidValueTx = {
            contents: unsignedTxs[2],
            sigs: [paypal.sign(unsignedTxs[2])]
        }
        assert.throws(() => { paypal.applyTransaction(invalidValueTx) }, Error)
    });
    it('should properly apply UTXO with one input and multiple outputs', function () {
        paypal.applyTransaction(signedTxs[0])
        assert.deepEqual(paypal.state, {
            txOutputs: [
                { value: 1000, owner: paypal.wallet.address },
                { value: 250, owner: alice.wallet.address },
                { value: 250, owner: bob.wallet.address },
                { value: 500, owner: paypal.wallet.address }
            ],
            isSpent: [1, 0, 0, 0]
        })
    });
    it('should throw Error when trying to spend spent TXOs', function () {
        assert.throws(() => { paypal.applyTransaction(signedTxs[0]) }, Error)
    });
    it('should throw Error when only contains some of the required sigs', function () {
        const someSigsTx = {
            contents: unsignedTxs[1],
            sigs: [alice.sign(unsignedTxs[1])]
        }
        assert.throws(() => { paypal.applyTransaction(someSigsTx) }, Error)
    });
    it('should properly apply UTXO with multiple inputs and multiple outputs', function () {
        paypal.applyTransaction(signedTxs[1])
        assert.deepEqual(paypal.state, {
            txOutputs: [
                { value: 1000, owner: paypal.wallet.address },
                { value: 250, owner: alice.wallet.address },
                { value: 250, owner: bob.wallet.address },
                { value: 500, owner: paypal.wallet.address },
                { value: 500, owner: paypal.wallet.address }
            ],
            isSpent: [1, 1, 1, 0, 0]
        })
    });
})
