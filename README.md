The Cryptoeconomics.study coding challenges follow the course lectures. This includes implementing a centralized payment processor, a distributed proof of authority blockchain, and a proof of work blockchain. To make sure that you can complete all the challenges we recommend the following development setup.

<br />

## Prerequisites

### Command Line Basics

In order to install the packages you need for development you're going to have to know how to navigate around the terminal.
- [OSX and Linux](https://www.taniarascia.com/how-to-use-the-command-line-for-apple-macos-and-linux/)
- [Windows, OSX, and Linux](https://lifehacker.com/a-command-line-primer-for-beginners-5633909)
- [Windows](https://www.makeuseof.com/tag/a-beginners-guide-to-the-windows-command-line/)

### Javascript

This course assumes a familiarity with the basics of Javascript. If you're new to programming, or just want a refresher, we recommend the following resources:
- [Understanding Classes In Javascript](https://www.taniarascia.com/understanding-classes-in-javascript/) - An intro to Javascript classes.
- [The Complete Javascript Handbook](https://www.freecodecamp.org/news/the-complete-javascript-handbook-f26b2c71719c/) - Updated in 2019. Takes about an hour or two to read (skim) and covers all the basics of Javascript.
- [FreeCodeCamp Javascript Course](https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/basic-javascript/) - Free community driven course to help people learn programming basics so that they can contribute to non-profits and open-source.
- [/r/javascript](https://www.reddit.com/r/javascript/) - The Reddit javascript community.

### NodeJS and NPM

You're going to need *Node.js* and *npm* to complete these assignments.

We recommend using a node version manager like [NVM](https://github.com/nvm-sh/nvm) to install and manage node/npm.

To install both on _any_ platform go [here](https://nodejs.org/en/).

If you're on Ubuntu, you can just run `sudo apt install nodejs npm`.

### Git and GitHub

You'll also need a Github account and `git` installed on your computer.

* Create a Github account [here](https://github.com/join).

* Setting up Git:
	* [Download and install the latest version of Git.](https://git-scm.com/downloads)
	* [Set your username in Git.](https://help.github.com/en/articles/setting-your-username-in-git)
	* [Set your commit email address in Git.](https://help.github.com/en/articles/setting-your-commit-email-address)
	* [Authenticate with Github from Git](https://help.github.com/en/articles/set-up-git#next-steps-authenticating-with-github-from-git)

### Mocha

We're going to be using [Mocha](https://mochajs.org/) in order to run tests, so install the Mocha package globally by running:
`npm install -g mocha`

### IDE / Text Editor

Feel free to use any IDE (integrated development environment) or text editor of your choosing to complete the course. Here are a couple options we recommend:

#### Atom

[Atom](https://atom.io/) is free, open source, and works on every major operating system. Furthermore, it's easy to configure and set up. We recommend this setup by [Elad Ossadon](https://medium.com/productivity-freak/my-atom-editor-setup-for-js-react-9726cd69ad20).

TL;DR:
- download [Atom](https://atom.io/)
- run this script to install some awesome atom plugins via apm (the Atom Package Manager)
```
apm install atom-beautify prettier-atom atom-transpose case-keep-replace change-case copy-path duplicate-line-or-selection editorconfig file-icons git-plus highlight-selected local-history project-manager related set-syntax sort-lines sublime-style-column-selection tab-foldername-index sync-settings toggle-quotes atom-wrap-in-tag atom-ternjs autoclose-html autocomplete-modules color-picker docblockr emmet emmet-jsx-css-modules es6-javascript js-hyperclick hyperclick pigments linter-eslint tree-view-copy-relative-path lodash-snippets language-babel react-es7-snippets atom-jest-snippets one-dark-ui dracula-theme
```

#### VIM

Another free and open source text editor is [VIM](https://www.vim.org/). VIM stands for VI Improved. It is one of the oldest and simplest text editors available. It's extremely light weight and works on every operating system. Tutorials on the use of VIM are beyond the scope of this course, however we recommend the following resources:
- [VIM Cheatsheet](https://vimsheet.com/) - a quick reference to the most common VIM commands/features.
- [/r/vim](https://www.reddit.com/r/vim/) - a friendly Reddit community that loves VIM (great place to learn and ask questions).
- [burrrata's VIM setup (ubuntu)](https://github.com/burrrata/ubuntu-dev-env) - designed to be quick to install, lightweight, and work on any Ubuntu VM even without a graphical user interface (just follow the apt, vim, and javascript sections).

#### Debugging
Many users like to just debug Javascript programs by using `console.log` to print out different variables. When `console.log` isn't cutting it, we recommend using Google Chrome DevTools to debug ([guide](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27)). It's an awesome tool that allows complete breakpoint debugging.

### Downloading the coding challenges

Once you have the prerequisites installed without error, fork [this repository](https://github.com/cryptoeconomics-study/code) ([guide](https://help.github.com/en/articles/fork-a-repo)).
Once you have your own fork at `github.com/YOUR_USERNAME/code`, create a local clone of your fork ([guide](https://help.github.com/en/articles/fork-a-repo#keep-your-fork-synced)).
`cd` into your local clone and run `npm install` to install all of the required dependencies.

### Staying up to date
To make sure your version of the coding project is up to date, you're going to need to add the original repository as a remote repository ([guide](https://help.github.com/en/articles/configuring-a-remote-for-a-fork)). You will have to run 
`git remote add upstream https://github.com/cryptoeconomics-study/code.git`. You can then merge the latest updates to the coding project into your fork by following this [guide](https://help.github.com/en/articles/syncing-a-fork). 
<br />

## Technical Difficulties?

### Reach out to the community :)

Often the first steps are the hardest and we want to make sure you have a great experience learning about cryptoeconomics. If you get stuck or encounter difficulty setting up your development environment please [reach out to the community](https://forum.cryptoeconomics.study/t/technical-difficulties-thread/512). Chances are you're not the only one experiencing difficulties. Reaching out allows us to
- solve your problem directly
- document what the problem was and how we solved it so that in the future people can find those answers quickly
- understand the problem and improve the course material so that it's more intuitive for everyone
It's a win for everyone! So if you get stuck, don't worry about it. Just post your problem on the community forum [technical difficulties thread](https://forum.cryptoeconomics.study/t/technical-difficulties-thread/512) and we'll do our best to help :)

### Chromebook Support

Chromebooks are great because they're cheap and secure. Lots of people have them. In order to make the course accessible to as many people as possible, we've created a [chromebook guide](chromebook.md).

<br />

## Taking the Course

Now that you're good to go, let's start the course!

The course will alternate between lecture videos and coding challenges, which will have you implementing the concepts from the preceding lecture. but you can also jump straight to the coding challenges Be aware that each coding challenge build upon the previous one, so it's important that you start at the beginning of each chapter and go all the way through. Good luck! 🍀

Don't forget to commit your progress to Github as you go. This will create checkpoints that allow you to go back if you made a mistake. It will also help us track your progress and review your work at the end of the course in order to award you a certificate of completion.

<br />

## Contributing

We welcome community contributions! There's lots of ways to get involved. Please see our [contributing](https://forum.cryptoeconomics.study/t/official-contribution-guidelines/453) pages for more information :)

<br />

