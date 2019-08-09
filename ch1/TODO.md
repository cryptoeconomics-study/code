# Questions

Is the README format in 1.1 better where there's hints under each code section, or 1.5 where there's an explicit TODO over each code section?

Should we use es6 syntax?

We want to use the airbnb javascript syntax right?



# Ch1 TODO List

1.4
- link to a simple Javascript UTXO model example on the internet
- create a README that introduces the student to the tutorial, then let them know it's optional as a "bonus" item, but not critical to understanding the rest of the course

Tests
- clean up 1.2 tests to be more DRY
- write 1.3 tests
- write 1.4 tests
- write 1.5 tests

Formatting
- make sure there are no references to TX (only Tx to keep consistency and camel-case-ability)
- make all javascript file names lowercase
- add a formatting/syntax guide to the initial dev setup README

Wrapping up
- make sure that all tests are set to test the student code vs the solutions



# Ch1 DONE List

Tests
- update 1.2 tests

DEMOS
- update 1.2 demo
- write 1.3 demo
- write 1.5 demo

READMEs
- update 1.1 README
- update 1.2 README
- write 1.3 README
- update 1.5 README

Formatting
- get ALE and prettier/eslint working so that it's easy to catch errors and format the code

1.2 Refactor
- refactor Paypal.js to separate functions to check code, apply tx, and process tx (check, apply, check pending) so that it flows better into 1.3
- rewrite TODO sections so that they have a consistent formatting (1.2 and 1.3 are not the same)

1.3, 1.4, and 1.5 code challenges

Removed FTPaypal from 1.5 because it doesn't seem legit. It's better as a README item than a piece of code because it doesn't really do anything. Code should do stuff.
