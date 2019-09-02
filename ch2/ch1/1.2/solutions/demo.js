const EthCrypto = require('eth-crypto');
const Client = require('./client.js');
const Paypal = require('./paypal.js');

console.log('/////////////////////////////////////');
console.log('// Hashing and Public/Private Keys //');
console.log('/////////////////////////////////////');

// Hashing A Message
console.log("\nLet's hash a message!");
const message = 'Hello World';
console.log('The message is: ', message);
const messageHash = EthCrypto.hash.keccak256(message);
console.log('The hash of that message is: ', messageHash);

// Creating Public/Private Keys
console.log('\nCreating public/private key pairs to sign and verify messages.');

// Init Alice
const alice = new Client();
console.log("Init Alice's Client\n", alice);

// Init Bob
const bob = new Client();
console.log("Init Bob's Client\n", bob);

// Init Carol
const carol = new Client();
console.log("Init Carol's Client\n", carol);

// Note
console.log(
  'Notice that on their own Alice, Bob, and Carol just have keys. In order to have accounts that can hold tokens they need to connect to a network. The Paypal network is one such network, but Bitcoin and Ethereum are also networks. The state of the network is what determines account balances, so how the network operates is very important to users.',
);
console.log(
  "Btw, you might notice that the public key is different than the address. This is because Ethereum addresses are generated from public, but are not exactly the same thing. Here's more info on that process: https://ethereum.stackexchange.com/questions/3542/how-are-ethereum-addresses-generated/3619#3619",
);

// Signing Messages
console.log('\nSigning Messages');
const messageFromAlice = 'My name is Alice';
console.log("Alice's message: ", messageFromAlice);
const hashedMessageFromAlice = alice.hash(messageFromAlice);
console.log('Now Alice has hashed her message:', hashedMessageFromAlice);
const signedMessageFromAlice = alice.sign(messageFromAlice);
console.log("Alice's message signature: ", signedMessageFromAlice);

// Verifying Messages
console.log("\nLet's help Bob verify Alice's message");
console.log(
  "To do this we need to verify the message signature and the message hash to see if they return Alice's address",
);
const isMessageFromAliceAuthentic = bob.verify(
  signedMessageFromAlice,
  hashedMessageFromAlice,
  alice.wallet.address,
);
console.log('Is the message authentic?');
console.log(isMessageFromAliceAuthentic);

// Note
console.log(
  '\nWhile this may seem like a silly example, message signing and verification allows us to securely connect to websites, download files from servers, and run any public blockchain network!\n',
);

console.log('/////////////////////////////////');
console.log('// Initial Paypal Network Demo //');
console.log('/////////////////////////////////');

// Setup Paypal network
const paypal = new Paypal();
console.log(paypal);

// Generate transaction
const aliceTx = alice.generateTx(bob.wallet.address, 10, 'send');
console.log('\nAlice sends a TX to Bob via the Paypal network\n', aliceTx);

// Check transaction signature
const checkAliceTx = paypal.checkTxSignature(aliceTx);
console.log("\nPaypal checks Alice's transaction to Bob. Is it valid?");
console.log(checkAliceTx);

// Check user address
paypal.checkUserAddress(aliceTx);
console.log(
  "\nPaypal checks if Alice and Bob have already opened accounts with Paypal. They have not, so Paypal adds their addresses to it's state\n",
  paypal,
);

// Check transaction type
console.log(
  "\nNow that Alice and Bob's addresses are in the Paypal network, Paypal checks to make sure that the transaction is valid. ",
);
console.log('Is it? ');
const checkAliceTxType = paypal.checkTxType(aliceTx);
console.log(
  'Alice has a balance of 0, but the transaction is trying to spend 10. In order to send tokens on the Paypal network Alice is going to have to have to buy them from Paypal Inc.',
);
console.log(
  "Alice really wants to use Paypal's network so she sells her right kidney and gets enough money to buy 100 of Paypal's magic tokens. Now Alice can finally participate in the network!",
);
alice.buy(100);
const mintAlice100Tokens = paypal.generateTx(alice.wallet.address, 100, 'mint');
paypal.processTx(mintAlice100Tokens);
console.log(paypal);

// Check user balance
console.log('\nAlice checks her balance with Paypal');
const checkAliceAccountBalance = alice.generateTx(
  paypal.wallet.address,
  0,
  'check',
);
paypal.checkTxType(checkAliceAccountBalance);

// Note
console.log(
  '\n// Notice that all Alice can do is send a message to the network and ask what her balance is. With a central operator Alice is trusting that the balance that she is told (and the balance in the database) is accurate. With a public blockchain like Bitcoin or Ethereum Alice can see the entire history of the network and verify transactions herself to make sure that everything is accurate.',
);

// Sending Tokens
console.log(
  '\nNow that Alice has verified that she has some tokens she wants to pay Bob back for the gallon of Ketchup he gave her. To do this Alice sends a transaction on the Paypal network',
);
const payBobBackForKetchup = alice.generateTx(bob.wallet.address, 55, 'send');
console.log(payBobBackForKetchup);
console.log('\nPaypal sees this transaction and processes it.');
paypal.processTx(payBobBackForKetchup);
console.log(paypal);

console.log(
  '\nYay! Now Bob has been made whole, Paypal sold some of their magic tokens, and Alice gets to live life on the edge with only one kidney. Everyone wins :)',
);
console.log('');
