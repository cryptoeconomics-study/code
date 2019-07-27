The Cryptoeconomics.study coding challenges follow the course lectures. This includes implementing a centralized payment processor, a distributed proof of authority blockchain, and a proof of work blockchain. To make sure that you can complete all the challenges we recommend the following development setup.

## Prerequisites

### Command Line Basics

In order to install the packages you need for development you're going to have to know how to navigate around the terminal. 
- [OSX and Linux](https://www.taniarascia.com/how-to-use-the-command-line-for-apple-macos-and-linux/) 
- [Windows, OSX, and Linux](https://lifehacker.com/a-command-line-primer-for-beginners-5633909)
- [Windows](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/)

### NodeJS and NPM

You're going to need *Node.js* and *npm* to complete these assignments. Install both at once [here](https://nodejs.org/en/).

### Mocha

We're going to be using [Mocha](https://mochajs.org/) in order to run tests, so install the Mocha package globally by running: 
`npm install -g mocha`

### Git and GitHub

You'll also need a Github account and `git` installed on your computer.

* Create a Github account [here](https://github.com/join).

* Setting up Git:
	* [Download and install the latest version of Git.](https://git-scm.com/downloads)
	* [Set your username in Git.](https://help.github.com/en/articles/setting-your-username-in-git)
	* [Set your commit email address in Git.](https://help.github.com/en/articles/setting-your-commit-email-address)
	* [Authenticate with Github from Git](https://help.github.com/en/articles/set-up-git#next-steps-authenticating-with-github-from-git)

### Atom

We recommend [Atom](https://atom.io/) as your IDE (integrated development environment). Atom is free, open source, and works on every major operating system. Furthermore, it's easy to configure and set up. We recommend this setup by [Elad Ossadon](https://medium.com/productivity-freak/my-atom-editor-setup-for-js-react-9726cd69ad20). 

TL;DR:
- download [Atom](https://atom.io/)
- run this script to install some awesome atom plugins via apm (the Atom Package Manager)
```
apm install atom-beautify prettier-atom atom-transpose case-keep-replace change-case copy-path duplicate-line-or-selection editorconfig file-icons git-plus highlight-selected local-history project-manager related set-syntax sort-lines sublime-style-column-selection tab-foldername-index sync-settings toggle-quotes atom-wrap-in-tag atom-ternjs autoclose-html autocomplete-modules color-picker docblockr emmet emmet-jsx-css-modules es6-javascript js-hyperclick hyperclick pigments linter-eslint tree-view-copy-relative-path lodash-snippets language-babel react-es7-snippets atom-jest-snippets one-dark-ui dracula-theme
```

## Javascript

This course assumes a familiarity with the basics of Javascript. If you're new to programming, or just want a refresher, we recommend the following resources:
- [Understanding Classes In Javascript](https://www.taniarascia.com/understanding-classes-in-javascript/) - An intro to Javascript classes.
- [The Complete Javascript Handbook](https://www.freecodecamp.org/news/the-complete-javascript-handbook-f26b2c71719c/) - Updated in 2019. Takes about an hour or two to read (skim) and covers all the basics of Javascript.
- [FreeCodeCamp Javascript Course](https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/basic-javascript/) - Free community driven course to help people learn programming basics so that they can contribute to non-profits and open-source.
- [/r/javascript](https://www.reddit.com/r/javascript/) - The Reddit javascript community.

## Local Development Environment

Once you have the prerequisites installed without error, fork [this repository](https://github.com/cryptoeconomics-study/code) ([guide](https://help.github.com/en/articles/fork-a-repo)).

Once you have your own fork at `github.com/YOUR_USERNAME/code`, create a local clone of your fork ([guide](https://help.github.com/en/articles/fork-a-repo#keep-your-fork-synced)).
`git clone https://github.com/YOUR_USERNAME/code.git`

`cd` into your local clone and run `npm install` to install all of the required dependencies.
```
$ cd code
$ npm install
```

> It is essential that you run `npm install` in the root directory of the project otherwise you will not be able to test your code! You should not have to install or initialize npm or any other packages anywhere else in the project after this. 
> If you have trouble with npm EACCESS errors try the following resources: 
> - [NPM's official recommendations on solving EACCESS errors](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
> - [Modifying permissions to remove EACCESS errors](https://stackoverflow.com/questions/50639690/on-npm-install-unhandled-rejection-error-eacces-permission-denied)

## Technical Difficulties?

Often the first steps are the hardest and we want to make sure you have a great experience learning about cryptoeconomics. If you get stuck or encounter difficulty setting up your development environment please [reach out to the community](https://forum.cryptoeconomics.study/t/technical-difficulties-thread/512). Chances are you're not the only one experiencing difficulties. Reaching out allows us to
- solve your problem directly
- document what the problem was and how we solved it so that in the future people can find those answers quickly
- understand the problem and improve the course material so that it's more intuitive for everyone
It's a win for everyone! So if you get stuck, don't worry about it. Just post your problem on the community forum [technical difficulties thread](https://forum.cryptoeconomics.study/t/technical-difficulties-thread/512) and we'll do our best to help :)

## Taking the Course

Now that you're good to go, let's start the course!

We recommend starting at the beginning of the [Course](https://burrrata.ch/docs/en/getting-started/welcome) with the lecture videos and then trying the coding challenges, but you can also jump straight to the coding challenges [here](https://burrrata.ch/coding-challenges). Whichever path you choose, be aware that they progress sequentially so it's important that you start at the beginning of each chapter and go all the way through. Good luck! 🍀
 
Don't forget to commit your progress to Github as you go. This will create checkpoints that allow you to go back if you made a mistake. It also creates a proof of work (get it... proof of work) that shows you actually went through the course :)

## Contributing

We welcome community contributions! There's lots of ways to get involved. Please see our [contributing](https://forum.cryptoeconomics.study/t/official-contribution-guidelines/453) pages for more information :)



