> If you haven't already, set up your local clone of the `/code` repo by following our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup)

## Fault Tolerance

Fault Tolerance is a worry for architecturally centralized systems (e.g. a system with a single database and server). However, it's important to note that many of the systems that we might call "centralized" are architecturally decentralized (e.g. they have multiple databases and servers around the world) and are thus fault tolerant. 
Here, we've implemented `FT_Paypal.js` an example of how we could make or central payment processor fault tolerant. 

## Rent Extraction

Rent extraction is one of the most dangerous properties of centralized systems, especially when they are run by for-profit companies.

Essentially, once a company has a monopoly or something close to one, they can extract rent from all their users. This "rent" could be anything from increasing prices to showing more ads.

To demonstrate rent extraction, let's add a $1 processing fee on every transaction if we have over 100 users. In order to check how many users we have, we'll just use the number of address keys in `this.state`, and in order to add the transaction fee, we'll just subtract `tx.contents.amount + 1` from the sender of all `spend` transactions, and add that extra 1$ to Paypal's balance.

> *Hint*: You can use `Object.keys(this.state).length` to get the number of keys in `this.state`

## Censorship

Censorship is one aspect that is inherent to centralized systems. 

Most blockchain protocols are designed to be censorship resistant.

Censorship will be very easy implement in `Paypal.js`. Initialize an empty array `this.blacklist` in your constructor that stores blacklisted addresses. If we see a transaction that is sending money from a blacklisted address, we should throw an error.

## Fraud

When a central payment operator has control over everyone's assets, it can act maliciously.

To simulate fraudulent activity, let's write a method, `stealAllFunds()` in `Paypal.js` which will iterate through every address in `this.state`, and sum up everyone else's balances, also setting all of their balance to 0. It will then take the sum of all of that money and add it to Paypal's balance, effectively stealing everyone's funds.



