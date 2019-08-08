# 1.4 UTXO Model

Would it make sense to rewrite 1.4 as explaining Plasma Cash rather than Bitcoin?
- easy metaphor: spend cash => get change
- easier to implement in a ~ realistic way: keep track of who's keys control which pieces of cash in a state
	- opportunity to revisit merkle trees
- real world use case: become a central operator that runs a plasma cash node
- make more sense in the context of extending our current central payments operator
- makes sense in the context of 1.5 because the potential for an exit scam shows the need for a cryptoeconomic exit mechanism



# Questions

Is the README format in 1.1 better where there's hints under each code section, or 1.5 where there's an explicit TODO over each code section?



# Ch1 TODO List

Demos
- write 1.5 demo

Tests
- update 1.2 tests
- write 1.3 tests
- write 1.5 tests

Formatting
- get ALE and prettier/eslint working so that it's easy to catch errors and format the code
- make sure there are no references to TX (only Tx to keep consistency and camel-case-ability)
- make all javascript file names lowercase



# Ch1 DONE List

DEMOS
- update 1.2 demo
- write 1.3 demo

READMEs
- update 1.1 README
- update 1.2 README
- write 1.3 README
- update 1.5 README

1.2 Refactor
- refactor Paypal.js to separate functions to check code, apply tx, and process tx (check, apply, check pending) so that it flows better into 1.3
- rewrite TODO sections so that they have a consistent formatting (1.2 and 1.3 are not the same)

1.3, 1.4, and 1.5 code challenges

Removed FTPaypal from 1.5 because it doesn't seem legit. It's better as a README item than a piece of code because it doesn't really do anything. Code should do stuff.
