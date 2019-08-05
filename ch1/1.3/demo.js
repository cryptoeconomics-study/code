const EthCrypto = require('eth-crypto')
const Client = require('./Client.js')
const Paypal = require('./Paypal.js')


// Paypal Network Demo
console.log('/////////////////////////////////')
console.log('// Paypal Network Demo w Nonces//')
console.log('/////////////////////////////////')

// Setup Paypal network
const paypal = new Paypal()
console.log('\nInitial Paypal network:')
console.log(paypal)

// Mint tokens for our users
console.log('\nToday Paypal has a promotion that new users get 100 free tokens for signing up')

// Alice signs up for Paypal
const alice = new Client()
const newUserAlice = paypal.generateTx(alice.wallet.address, 100, 'mint')
paypal.processTx(newUserAlice)

// Bob signs up for Paypal
const bob = new Client()
const newUserBob = paypal.generateTx(bob.wallet.address, 100, 'mint')
paypal.processTx(newUserBob)

// Carol signs up for Paypal
const carol = new Client()
const newUserCarol = paypal.generateTx(carol.wallet.address, 100, 'mint')
paypal.processTx(newUserCarol)

// Paypal's first users
console.log('\nLet\'s look at the state of Paypal\'s network now that there are a few users:')
console.log(paypal)

// Generate transaction
const aliceTx = alice.generateTx(bob.wallet.address, 10, 'send')
console.log('\nAlice generates a transaction to send 10 tokens to Bob.')
console.log(aliceTx)

// Mandatory waiting period, because... YOLO
console.log('\nPaypal does not process the transaction right away...')

// Generating another transaction
console.log('\nAlice gets impatient and submits the transaction again, because clicking things is more satisfying than waiting.')
const aliceTx2 = alice.generateTx(bob.wallet.address, 10, 'send')
console.log(aliceTx2)

// Paypal gets the transactions
paypal.processTx(aliceTx2)
console.log('\nDue to a network error, Paypal gets Alice\'s second transaction first and it goes in the pendingTx pool')
console.log(paypal)
paypal.processTx(aliceTx)
console.log('\nPaypal then gets Alice\'s first transaction, processes it, and then processes any transactions in the pendingTx pool')
console.log(paypal)

// SNAFU
console.log('\nOh no! Alice has actually sent Bob 20 tokens instead of the 10 she intended. What to do...')
console.log('Lucky for Alice, Paypal has a cancel transaction feature. Yes that\'s right! Alice can cancel her transaction, for a small fee of course...')
console.log('Since the fee is smaller than the extra 10 tokens Alice sent, she sends a cancelation transaction to Paypal and gets her tokens back')
// note: nonces are zero indexed, so they start at 0, then 1, then 2, etc...
const aliceTx2Cancellation = alice.generateTx(paypal.wallet.address, 0, 'cancel')
paypal.processTx(aliceTx2Cancellation)

// All's well that ends well
console.log('\nNow let\'s look at Paypal\'s state to see everyone\'s accounts and balances')
console.log(paypal)

// Feature or bug? You decide!
console.log('note that when you\'re using a centralized payment processor\'s database, they set the rules and can manipulate the state arbitrarily. This can be good if you\'re worried about regulatory compliance or the abilty to revert errors, but it also means that there are no gaurantees that your account, funds, or transactions are valid. With decentralized networks like Bitcoin and Ethereum transactions are immutable and no one can stop them, not even you. Feature or bug? You decide!')

