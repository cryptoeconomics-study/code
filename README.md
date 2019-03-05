# 👾 Coding Project
This repository contains code for the protocols and attacks covered in the Cryptoeconomics.study course. This includes implementing a payment processor blockchain, proof of work, proof of stake, and Plasma.

Much of the code here will be reviewed in online videos which karl.tech and other community members put together. Links to these tutorial videos coming soon!

After protocols and attacks are implemented here, they will be formalized into lessons hosted on Chainshot. If you'd like to help build the lessons  check out the **[chainshot-content repo](https://github.com/cryptoeconomics-study/chainshot-content)**.

## Contributing
Suggestions and contributions are extremely welcome. For instance, there might be room in the curriculum to implement a simple state channel as well. There is also room for contributors to optimize the code as well as create **[visualizations](https://github.com/cryptoeconomics-study/visualizations)**. Check out the open issues and project board and help out! Feel free to add any questions, suggestions, or ideas as issues! :) 


## Coding Project Outline

### Ch. 1 - Node Implementation
- [x] Account Model
	- [Code review video](https://www.youtube.com/watch?v=e36n0WG4tgY)
- [x] UTXO Model
	- [Code review video](https://www.youtube.com/watch?v=t_x9ReUewZ4)


### Ch. 2 - Adding Networking
- [x] Network Simulator with nodes sending each other “hello world”
  - Network simulator implementation - [completed](https://github.com/cryptoeconomics-study/code/blob/master/c2_NetworkDoubleSpends/networksim.js)
- [x] Nodes sending transactions
  - [x] Send transactions until invalid tx found - [completed](https://github.com/cryptoeconomics-study/code/blob/master/c2_NetworkDoubleSpends/invalidWithHonestNodes.js)
  - [x] Intentionally double spend - [completed](https://github.com/cryptoeconomics-study/code/blob/master/c2_NetworkDoubleSpends/doubleSpend.js)
-  [x] Latency-Based Consensus Client
	- [x] Timestamp attack
	- [x] Double Spend attack
	- [ ] Byzantine node attack 
- [ ] PoA Consensus
	- [ ] Authority Client
	- [ ] PoA User Client

### Ch. 3 - Adding Proof of Work block proposal
- [ ] Nodes sending blocks
  - Instead of each node generating and sending a transaction, generate a transaction and put it in a block which point to previous blocks
  - Create blocks only one the longest known chain of blocks which the node has
  - Clients still apply all transactions, whether or not they are on the longest chain.
- [ ] Proof of work on the blocks
  - Add anti-spam protection with proof of work on each block
  - See implementation here: https://github.com/karlfloersch/lessons/blob/master/lessons/02_proofOfWork.js#L16-L26
- [ ] Fork choice
  - Only apply transactions which are contained in the longest chain
  - Lazily apply these transactions (create function `getState()` which applies all the transactions in the chain and returns the resulting state object.
- [ ] Miner // client separation
  - Add Miner class which collects txs & makes blocks
  - Add Client class which generates & sends transactions
- [ ] Selfish Mining client implementation
	- [ ] Add block rewards, cost simulation of mining

### Ch. 4 - Adding Proof of Stake Finality (FFG)
- [ ] Add validator class
- [ ] Add deposit transaction which locks coins
- [ ] Add withdraw transaction which unlocks coins (after some delay)
- [ ] Add `vote()` which votes on the current epoch, if more than ⅔ vote then the block is finalized
- [ ] Update the fork choice rule to not revert finalized blocks, and accept a ‘starting block’ blockhash.

### Ch. 5 - Instead Implement as Plasma with a Central Operator
- [ ] Create `rootChain.sol` which accepts block hashes
- [ ] Create `merkleProof.sol` which validates merkle proofs
- [ ] Using https://github.com/ethereum/py-evm write tests which:
  - Deploy the merkle prover & root chain
  - Deposit test ETH to the root chain, creating a new Plasma Cash coin
  - Submit merkle proofs to the root chain contract which transfer the coin
  - Exit the coin with a different account than the one that deposited
- [ ] Add exit challenges

## Stretch Goals!
- [x] Ch. 2 - Network message propagation visualization (Interested in consensus algorithm visualizations? Check out the [/visualizations repo](https://github.com/cryptoeconomics-study/visualizations))
- [ ] Ch. 5 - zkSTARK or zkSNARK implementation/usage?
- [ ] Ch. 5 - State Channel implementation
- [ ] Implementations in other languages
- [ ] Missing any valuable protocols  or attacks? Add an issue and let's discuss!


