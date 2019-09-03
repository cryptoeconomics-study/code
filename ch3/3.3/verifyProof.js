function verifyProof(proof, node, root, concat) {
    let data = node;
    for (let i = 0; i < proof.length; i++) {
        const arr = (proof[i].left) ? [proof[i].data, data] : [data, proof[i].data];
        data = concat(...arr);
    }
    return data.equals(root);
}

module.exports = verifyProof;
