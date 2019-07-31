const Client = require('../Client.js')
//const Client = require('../solution/Client.js')
const Paypal = require('../Paypal.js');
//const Paypal = require('../solution/Paypal.js');
const EthCrypto = require('eth-crypto')
const assert = require('assert')

// Test The Client
describe('Client Tests', function() {
	// Test Transaction Generation
	describe('Generate Transactions', function () {
		// init params
		let alice = new Client(),
			bob = new Client(),
			tx,
			unsignedTx
		// run the tests
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
})

// Test Paypal
describe('Paypal Tests', function() {
	// Test Contructor
	describe('Constructor', function () {
		// init params
		const paypal = new Paypal()
		const genesis = {
			[paypal.wallet.address]: {
				balance: 1000000
			}
		}
		// run the tests
		it('should properly set this.state', function () {
			assert.deepEqual(paypal.state, genesis)
		});
		it('should properly set this.txHistory', function () {
			assert.deepEqual(paypal.txHistory, [])
		})
	})

	// Test Transaction Signature Check
	describe('Transaction Signature Check', function() {
		// init params
		const paypal = new Paypal()
		const alice = new Client()
		const bob = new Client()
		const aliceUnsignedTx = {
			type: 'send',
			amount: 10,
			from: alice.wallet.address,
			to: bob.wallet.address,
		}
		const invalidTx = {
			contents: aliceUnsignedTx,
			sig: bob.sign(aliceUnsignedTx)
		}
		const validTx = {
			contents: aliceUnsignedTx,
			sig: alice.sign(aliceUnsignedTx)
		}
		// run the tests
		it('should fail because the sender is not Alice', function() {
			assert.equal(false, paypal.checkTxSignature(invalidTx))
		})
		it('should pass if the sender and signer are the same', function() {
			assert.equal(true, paypal.checkTxSignature(validTx))
		})
	})

	// Test User Address Check
	describe('User Address Check', function() {
		// init params
		const paypal = new Paypal()
		const bob = new Client()
		const alice = new Client()
		const aliceTx = alice.generateTx(bob.wallet.address, 10, 'send')
		// run the tests
		it('should pass even though Alice is not already in the newly created Paypal state', function() {
			assert.equal(true, paypal.checkUserAddress(aliceTx))
		})
		it('Alice\'s address should have a 0 balance in the paypal state', function() {
			assert.equal(0, paypal.state[alice.wallet.address].balance)
		})
	})

	// Test TX Check
	describe('TX Check', function() {
		// init params
		const paypal = new Paypal()
		const bob = new Client()
		const alice = new Client()
		// run the tests
		it('should return false because Alice has a balance of 0 with Paypal, but the transaction amount is 10', function() {
			const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send')
			// we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
			paypal.checkUserAddress(aliceTx2Bob)
			assert.equal(false, paypal.checkTxType(aliceTx2Bob))
		})
		it('should return false because Alice is just checking her balance and true would move her transaction through to processing in the state transition function', function() {
			const aliceBalanceCheck = alice.generateTx(paypal.wallet.address, 0, 'check')
			assert.equal(false, paypal.checkTxType(aliceBalanceCheck))
		})
		it('should return true because this is a test to test the tests', function() {
			assert.equal(true, true)
		})
		it('should return false because Alice is not authorized to mint tokens on the Paypal network', function() {
			const invalidMint = alice.generateTx(alice.wallet.address, 1000, 'mint')
			assert.equal(false, paypal.checkTxType(invalidMint))
		})
		it('should return true because Paypal is authorized to mint tokens on their own network', function() {
			const validMint = paypal.generateTx(paypal.wallet.address, 1000, 'mint')
			assert.equal(true, paypal.checkTxType(validMint))
		})
	})

	// Test Transaction Processing
	describe('Transaction Processing', function() {
		// init params
		const paypal = new Paypal()
		const alice = new Client()
		const bob = new Client()
		// run the tests
		it('should return true because the processTransaction() function assumes that any tx it receives is valid', function() {
			const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send')
			// we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
			paypal.checkUserAddress(aliceTx2Bob)
			assert.equal(true, paypal.processTransaction(aliceTx2Bob))
		})
		it('should return true because the processTransaction() function assumes that any tx it receives is valid', function() {
			const aliceTx2Alice = alice.generateTx(alice.wallet.address, 10, 'send')
			// we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
			paypal.checkUserAddress(aliceTx2Alice)
			assert.equal(true, paypal.processTransaction(aliceTx2Alice))
		})
	})

	// Test State Transition Function
	describe('State Transition Function', function() {
		// init params
		const paypal = new Paypal()
		const alice = new Client()
		const bob = new Client()
		const aliceUnsignedTx = {
			type: 'send',
			amount: 10,
			from: alice.wallet.address,
			to: bob.wallet.address,
		}
		const invalidTx = {
			contents: aliceUnsignedTx,
			sig: bob.sign(aliceUnsignedTx)
		}
		// run the tests
		it('should return false because the sender is not Alice', function() {
			assert.equal(false, paypal.stateTransitionFunction(invalidTx))
		})
		it('should return false because Alice has a balance of 0 with Paypal, but the transaction amount is 10', function() {
			const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send')
			// we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
			paypal.checkUserAddress(aliceTx2Bob)
			assert.equal(false, paypal.stateTransitionFunction(aliceTx2Bob))
		})
		it('should return true because Paypal is authorized to mind tokens on their own network', function() {
			const validMint = paypal.generateTx(paypal.wallet.address, 1000, 'mint')
			assert.equal(true, paypal.stateTransitionFunction(validMint))
		})
		it('should return true because Paypal is minting tokens for Alice to spend, adding Alice and Bob to the state, and Alice is creating a valid transaction to Bob', function() {
			const validMint = paypal.generateTx(alice.wallet.address, 1000, 'mint')
			paypal.stateTransitionFunction(validMint)
			const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send')
			// we need to check the user address in order to add Alice and Bob to the state to then see that she has a 0 balance
			//paypal.checkUserAddress(aliceTx2Bob)
			assert.equal(true, paypal.stateTransitionFunction(aliceTx2Bob))
		})
		it('should return true because Paypal is minting tokens for Alice to spend, adding Alice and Bob to the state, and Alice is creating a valid transaction to send tokens to Bob', function() {
			const validMint = paypal.generateTx(alice.wallet.address, 1000, 'mint')
			paypal.stateTransitionFunction(validMint)
			const aliceTx2Bob = alice.generateTx(bob.wallet.address, 10, 'send')
			paypal.stateTransitionFunction(aliceTx2Bob)
			// the test above this just sent 10 tokens to Bob, and now we're sending 10 more
			assert.equal(20, paypal.state[bob.wallet.address].balance)
		})
	})
})

