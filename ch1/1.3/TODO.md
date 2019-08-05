

get ALE and prettier/eslint working so that it's easy to catch errors and format the code

make sure all TX are Tx
- figure out how to run a case sensitive search and replace in VIM

make sure that every single branch of every function is run in demo.js and run as a mocha test


make generateTx add a transaction to Paypal's pendingTx pool
then make it up to Paypal to process transactions if/when they're ready



add BUY as a transaction type











rewrite stateTransitionFunction() so that it loops through all pendingTx and processes those that match the nonce that Paypal has for the sender
then loops back through to check if any tx match the nonce that Paypal has for the sender
and continues doing so until there are no more valid pending tx


es6 (for i in X) search
- for (let i in X) {}
- https://www.tutorialspoint.com/es6/es6_arrays







