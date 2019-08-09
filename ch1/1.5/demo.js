const EthCrypto = require('eth-crypto');
const Client = require('./Client.js');
const Paypal = require('./Paypal.js');

// Paypal Network Demo
console.log('//////////////////////////////////////////');
console.log('// Paypal Network Demo w Rent Extraction//');
console.log('//////////////////////////////////////////');

// Setup Paypal network
const paypal = new Paypal();
console.log('\nInitial Paypal network:');
console.log(paypal);

// Mint tokens for our users
console.log(
  '\nToday Paypal has a promotion that new users get 100 free tokens for signing up',
);

// Alice signs up for Paypal
const alice = new Client();
const newUserAlice = paypal.generateTx(alice.wallet.address, 1000, 'mint');
paypal.processTx(newUserAlice);

// Bob signs up for Paypal
const bob = new Client();
const newUserBob = paypal.generateTx(bob.wallet.address, 1000, 'mint');
paypal.processTx(newUserBob);

// Carol signs up for Paypal
const carol = new Client();
const newUserCarol = paypal.generateTx(carol.wallet.address, 1000, 'mint');
paypal.processTx(newUserCarol);

// Dave signs up for Paypal
const dave = new Client();
const newUserDave = paypal.generateTx(dave.wallet.address, 1000, 'mint');
paypal.processTx(newUserDave);

// Earl signs up for Paypal
const eve = new Client();
const newUserEve = paypal.generateTx(eve.wallet.address, 1000, 'mint');
paypal.processTx(newUserEve);

// Frank signs up for Paypal
const frank = new Client();
const newUserFrank = paypal.generateTx(frank.wallet.address, 1000, 'mint');
paypal.processTx(newUserFrank);

// George signs up for Paypal
const george = new Client();
const newUserGeorge = paypal.generateTx(george.wallet.address, 1000, 'mint');
paypal.processTx(newUserGeorge);

// Harry signs up for Paypal
const harry = new Client();
const newUserHarry = paypal.generateTx(harry.wallet.address, 1000, 'mint');
paypal.processTx(newUserHarry);

// Ian signs up for Paypal
const ian = new Client();
const newUserIan = paypal.generateTx(ian.wallet.address, 1000, 'mint');
paypal.processTx(newUserIan);

// Jill signs up for Paypal
const jill = new Client();
const newUserJill = paypal.generateTx(jill.wallet.address, 1000, 'mint');
paypal.processTx(newUserJill);

// Paypal's first users
console.log(
  "\nLet's look at the state of Paypal's network now that there are a few users:",
);
console.log(paypal);

// The only constant is change
console.log(
  "\nLet's imagine that some time has passed... Paypal is doing well and has lots of users. Naturally, Paypal decides to implement fees. Users are already using Paypal and don't want to switch, so the fee isn't THAT big of a deal. Let's see how it affects their balances over time",
);

// BONUS TODO (not directly related to understanding cryptoeconomic mechanisms, but a good programming exercise non the less)
// Death by 1000 transaction fees
function financialAttrition(...users) {
  // simulate 1000 transactions
	// TODO
    // pick a random value between 1 and 10
		// TODO
    // choose two users at random, but excluding Paypal
		// TODO
    // create a transaction from one random user to another
		// TODO
    // process the transaction
		// TODO
	// print Paypa;'s balance and/or the full state to the console every 100 iterations so we can see the progress
		// TODO
}

financialAttrition(
  alice,
  bob,
  carol,
  dave,
  eve,
  frank,
  george,
  harry,
  ian,
  jill,
);

// The truth will set you free
console.log(
  "\nWow! Shocking... Paypal made money while everyone else's balance went down. One could argue that this is because Paypal provides a valuable service and is compensated for that, which is a fair and reasonable this to say. IF, however, Paypal gained a monopoly and started raising the fees... well then that would be a different story. Try playing with the model to see what happens with different fees.",
);

// The plot thickens...
console.log(
  "\nWell that was fun. But wait! There's more. It turns out that Eve was actually a space pirate, and Paypal is forbidden from serving space pirates. Upon hearing this news, Paypal adds Eve's address to the blacklist (duhn duhn duhn...). Eve is now banned from using Paypal or their services.",
);
paypal.blacklist.push(eve.wallet.address);

console.log("Let's see what happens now...");
financialAttrition(
  alice,
  bob,
  carol,
  dave,
  eve,
  frank,
  george,
  harry,
  ian,
  jill,
);

console.log(
  "\nLooks like most of Paypal's users are now too broke or too outlawed to use the network... Hmmm if only there was a way for everyone to transact without a central operator. Oh wait, there is! Bitcoin, Ethereum, and other crypto-currencies allow users to send and receive value with (relatively) low fees. Best of all, anyone can participate! In the next chapter we'll explore what some of these networks look like :)",
);
