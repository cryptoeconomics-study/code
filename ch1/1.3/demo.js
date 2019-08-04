const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')
const Paypal = require('./Paypal.js')

console.log('/////////////////////////////////')
console.log('// Paypal Network Demo w Nonces//')
console.log('/////////////////////////////////')


// Setup Paypal network
const paypal = new Paypal()
console.log(paypal)

// Generate transaction
const aliceTx = alice.generateTx(bob.wallet.address, 10, 'send')
console.log('\nAlice sends a TX to Bob via the Paypal network\n', aliceTx)

// Check the transaction's signature
const checkAliceTx = paypal.checkTxSignature(aliceTx)
console.log('\nPaypal checks Alice\'s transaction to Bob. Is it valid?')
console.log(checkAliceTx)

// Check the transaction's nonce
const checkAliceTxNonce = paypal.checkAliceTxNonce(aliceTx)
console.log('\nWhat about the nonce?');
console.log(checkAliceTxNonce);

// Check user address
paypal.checkUserAddress(aliceTx)
console.log('\nPaypal checks if Alice and Bob have already opened accounts with Paypal. They have not, so Paypal adds their addresses to it\'s state\n', paypal)

// Check transaction type
console.log('\nNow that Alice and Bob\'s addresses are in the Paypal network, Paypal checks to make sure that the transaction is valid. ')
console.log('Is it? ')
const checkAliceTxType = paypal.checkTxType(aliceTx)
console.log('Alice has a balance of 0, but the transaction is trying to spend 10. In order to send tokens on the Paypal network Alice is going to have to have to buy them from Paypal Inc.')
console.log('Alice really wants to use Paypal\'s network so she sells her right kidney and gets enough money to buy 100 of Paypal\'s magic tokens. Now Alice can finally participate in the network!')
alice.buy(100)
const mintAlice100Tokens = paypal.generateTx(alice.wallet.address, 100, 'mint')
paypal.processTransaction(mintAlice100Tokens)
console.log(paypal)

// Check user balance
console.log('\nAlice checks her balance with Paypal')
const checkAliceAccountBalance = alice.generateTx(paypal.wallet.address, 0, 'check')
paypal.checkTxType(checkAliceAccountBalance)

// Note
console.log('\n// Notice that all Alice can do is send a message to the network and ask what her balance is. With a central operator Alice is trusting that the balance that she is told (and the balance in the database) is accurate. With a public blockchain like Bitcoin or Ethereum Alice can see the entire history of the network and verify transactions herself to make sure that everything is accurate.')

// Sending Tokens
console.log('\nNow that Alice has verified that she has some tokens she wants to pay Bob back for the gallon of Ketchup he gave her. To do this Alice sends a transaction on the Paypal network')
const payBobBackForKetchup = alice.generateTx(bob.wallet.address, 55, 'send')
console.log(payBobBackForKetchup)
console.log('\nPaypal sees this transaction and processes it.')
paypal.stateTransitionFunction(payBobBackForKetchup)
console.log(paypal)

console.log('\nYay! Now Bob has been made whole, Paypal sold some of their magic tokens, and Alice gets to live life on the edge with only one kidney. Everyone wins :)')
console.log('')
