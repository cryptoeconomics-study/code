const crypto = require("crypto");
const assert = require("assert");

// use the crypto module to create a sha256 hash from the data passed in
function sha256(data) {
    return crypto.createHash('sha256').update(data).digest();
}

// the concat function we use to hash together merkle leaves
function concatHash(left, right) {
    if (!left) throw new Error("The concat function expects two hash arguments, the first was not receieved.");
    if (!right) throw new Error("The concat function expects two hash arguments, the second was not receieved.");
    return sha256(Buffer.concat([left, right]));
}

// the concat function we use to show the merkle root calculation
function concatLetters(left, right) {
    return `Hash(${left} + ${right})`;
}

// given a proof, finds the merkle root
function hashProof(node, proof) {
    let data = sha256(node);
    for (let i = 0; i < proof.length; i++) {
        const buffers = (proof[i].left) ? [proof[i].data, data] : [data, proof[i].data];
        data = sha256(Buffer.concat(buffers));
    }
    return data;
}

// a helper function that will check to see if the tree generates the correct merkle root
// the complexity of this function is mostly to help debug when something has gone wrong.
// In the case where a bad hash is returned, the calculation is logged
function testTree(MerkleTree, leaves, expectedHash, expectedLetters) {
    const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
    const lettersTree = new MerkleTree(leaves, concatLetters);
    if (!hashTree.getRoot()) {
        assert(false, "Did not recieve a hash from the getRoot() function");
    }
    const actualHash = hashTree.getRoot().toString('hex');
    const actualLetters = lettersTree.getRoot().toString('hex');
    if (actualHash !== expectedHash) {
        console.log(
            `Merkle Leaves were: ${leaves.toString()} \n\n` +

            `We were expecting the calculated hash to be: ${expectedHash}\n` +
            `This would be the result of this calculation: ${expectedLetters}\n\n` +

            `We recieved this hash from getRoot(): ${actualHash}\n` +
            `Which is a result of this calculation: ${actualLetters}`)
    }
    assert.equal(actualHash, expectedHash,
        `Your hash was calculated ${actualLetters}, we were expecting ${expectedLetters}`
    );
}

module.exports = {concatHash, concatLetters, testTree, hashProof, sha256}
