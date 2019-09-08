const assert = require('assert');
const {hashProof, sha256, concatHash, concatLetters, testTree} = require('./testUtil');
const MerkleTree = require('../merkleTree');
const verify = require('../verifyProof');

describe('Combine Two Leaves', function() {
  it('should create a root from two hashes', function() {
    const leaves = ['A', 'B'];
    const expectedHash = "63956f0ce48edc48a0d528cb0b5d58e4d625afb14d63ca1bb9950eb657d61f40";
    const expectedLetters = "Hash(A + B)";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });
});

describe('Multiple Layers', function() {
  it('should handle the base case', function() {
    const leaves = ['A'];
    const expectedHash = "559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd";
    const expectedLetters = "A";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });

  it('should create a root from two hashes', function() {
    const leaves = ['A', 'B'];
    const expectedHash = "63956f0ce48edc48a0d528cb0b5d58e4d625afb14d63ca1bb9950eb657d61f40";
    const expectedLetters = "Hash(A + B)";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });

  it('should create a root from four hashes', function() {
    const leaves = ['A', 'B', 'C', 'D'];
    const expectedHash = "1b3faa3fcc5ed50cd8592f805c6f8fce976b8582c739b26a6f3613b7f9b13617";
    const expectedLetters = "Hash(Hash(A + B) + Hash(C + D))";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });
});

describe('Odd Leaves', function() {
  it('should handle three hashes', function() {
    const leaves = ['A', 'B', 'C'];
    const expectedHash = "dbe11e36aa89a963103de7f8ad09c1100c06ccd5c5ad424ca741efb0689dc427";
    const expectedLetters = "Hash(Hash(A + B) + C)";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });

  it('should handle five hashes', function() {
    const leaves = ['A', 'B', 'C', 'D', 'E'];
    const expectedHash = "8e5eeb6f73b5c475dbcd8ea8288a62075e64464254999d1ac59b3a0ad398ec35";
    const expectedLetters = "Hash(Hash(Hash(A + B) + Hash(C + D)) + E)";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });

  it('should handle seven hashes', function() {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F' ,'G'];
    const expectedHash = "123b5a4d8e88533817f040984914ab5cf9f5b24b032a421587c85d7926d615fe";
    const expectedLetters = "Hash(Hash(Hash(A + B) + Hash(C + D)) + Hash(Hash(E + F) + G))";
    testTree(MerkleTree, leaves, expectedHash, expectedLetters);
  });
});


describe('Build The Proof', function() {
  const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const root = 'eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526';
  const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
  const lettersTree = new MerkleTree(leaves, concatLetters);

  describe('for each leaf', function() {
    leaves.forEach((leaf, i) => {
      it(`should return a proof that calculates the root from leaf ${leaves[i]}`, function() {
        const proof = hashTree.getProof(i);
        const hashedProof = hashProof(leaf, proof).toString('hex');
        if(hashedProof !== root) {
          const lettersProof = lettersTree.getProof(i);
          console.log(
            "The resulting hash of your proof is wrong. \n" +
            `We were expecting: ${root} \n` +
            `We recieved: ${hashedProof} \n` +
            `In ${leaves.join('')} Merkle tree, the proof of ${leaves[i]} you gave us is: \n` +
            `${JSON.stringify(lettersProof, null, 2)}`
          );
        }
        assert.equal(hashedProof, root);
      });
    });
  });
});

describe('Verifying Your Proof', function() {
  describe('a given merkle tree', function() {
    const leaves = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].map(sha256);
    const tree = new MerkleTree(leaves, concatHash);

    describe('untampered proofs', function() {
      leaves.forEach((_, i) => {
        it(`should verify the proof for leaf index ${i}`, function() {
          const proof = tree.getProof(i);
          assert.equal(verify(proof, leaves[i], tree.getRoot(), concatHash), true);
        });
      });
    });

    describe('tampered proofs', function() {
      describe('verifying a different node with a proof', function() {
        it('should not verify the proof', function() {
          let proof = tree.getProof(2);
          assert.equal(verify(proof, leaves[3], tree.getRoot(), concatHash), false);
        });
      });

      describe('verifying a different root', function() {
        it('should not verify the proof', function() {
          let proof = tree.getProof(2);
          assert.equal(verify(proof, leaves[2], sha256("root"), concatHash), false);
        });
      });

      describe('flipping a nodes position', function() {
        it('should not verify the proof', function() {
          let proof = tree.getProof(3);
          proof[1].left = !proof[1].left;
          assert.equal(verify(proof, leaves[3], tree.getRoot(), concatHash), false);
        });
      });

      describe('editing a hash', function() {
        it('should not verify the proof', function() {
          let proof = tree.getProof(5);
          proof[2].data = sha256('edited');
          assert.equal(verify(proof, leaves[5], tree.getRoot(), concatHash), false);
        });
      });
    });
  });
});
