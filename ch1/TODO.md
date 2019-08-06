# Questions

Would it make sense to rewrite 1.4 as explaining Plasma Cash rather than Bitcoin?
- easy metaphor: spend cash => get change
- easier to implement in a ~ realistic way: keep track of who's keys control which pieces of cash in a state
	- opportunity to revisit merkle trees
- real world use case: become a central operator that runs a plasma cash node
- make more sense in the context of extending our current central payments operator
- makes sense in the context of 1.5 because the potential for an exit scam shows the need for a cryptoeconomic exit mechanism


# Ch1 TODO List

Refactor 1.2
- separate functions to check code, apply tx, and process tx (check, apply, check pending) so that it flows better into 1.3
- rewrite TODO sections so that they have a consistent formatting (1.2 and 1.3 are not the same)

Write 1.3 README

Test.js
- make sure that every single branch of every function is run in demo.js and/or run as a mocha test

Demo.js
- for the demo, it actually might make more sense to NOT have it commented out, that way the student is guided by an idea of what/how the program is supposed to work
- this would make the main purpose of demo.js to guide the student and help them visualize the code vs being another challenge (which I think is the right way to go since we're introducing a lot more complexity into the code challenges now)

Formatting
- get ALE and prettier/eslint working so that it's easy to catch errors and format the code
- make sure there are no references to TX (only Tx to keep consistency and camel-case-ability)
- make all javascript file names lowercase


# Ch1 DONE List

1.3, 1.4, and 1.5 code challenges

Removed FTPaypal from 1.5 because it doesn't seem legit. It's better as a README item than a piece of code because it doesn't really do anything. Code should do stuff.
