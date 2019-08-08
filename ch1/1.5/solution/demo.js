const EthCrypto = require("eth-crypto");
const Client = require("./Client.js");
const Paypal = require("./Paypal.js");

// Paypal Network Demo
console.log("//////////////////////////////////////////");
console.log("// Paypal Network Demo w Rent Extraction//");
console.log("//////////////////////////////////////////");

// Setup Paypal network
const paypal = new Paypal();
console.log("\nInitial Paypal network:");
console.log(paypal);

// Mint tokens for our users
console.log(
  "\nToday Paypal has a promotion that new users get 100 free tokens for signing up"
);

// Alice signs up for Paypal
const alice = new Client();
const newUserAlice = paypal.generateTx(alice.wallet.address, 100, "mint");
paypal.processTx(newUserAlice);

// Bob signs up for Paypal
const bob = new Client();
const newUserBob = paypal.generateTx(bob.wallet.address, 100, "mint");
paypal.processTx(newUserBob);

// Carol signs up for Paypal
const carol = new Client();
const newUserCarol = paypal.generateTx(carol.wallet.address, 100, "mint");
paypal.processTx(newUserCarol);

// Paypal's first users
console.log(
  "\nLet's look at the state of Paypal's network now that there are a few users:"
);
console.log(paypal);

// The only constant is change
console.log("Let's imagine that some time has passed... Paypal is doing well and has lots of users. Naturally, Paypal decides to implement fees. );

