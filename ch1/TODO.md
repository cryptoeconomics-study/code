# Ch1 TODO List


## Formatting
- get ALE and prettier/eslint working so that it's easy to catch errors and format the code
- make sure there are no references to TX (only Tx to keep consistency and camel-case-ability)
- make all javascript file names lowercase


## Things to do after the code is written for all chapters and a consistent style/architecture is determined

Refactor 1.2 so that it flows better into 1.3
- separate functions to check code, apply tx, and process tx (check, apply, check pending)

Test.js
- make sure that every single branch of every function is run in demo.js and/or run as a mocha test

Demo.js
- for the demo, it actually might make more sense to NOT have it commented out, that way the student is guided by an idea of what/how the program is supposed to work
- this would make the main purpose of demo.js to guide the student and help them visualize the code vs being another challenge (which I think is the right way to go since we're introducing a lot more complexity into the code challenges now)

README.md
- it makes sense to get all the code for the chapter written FIRST, then write the readmes explaining the code
