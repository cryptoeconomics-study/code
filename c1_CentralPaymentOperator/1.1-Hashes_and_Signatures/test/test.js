const Client = require('../Client.js')
const EthCrypto = require('eth-crypto')
const assert = require('assert')

describe('Hash', function() {
    const data = Math.random();
    const client = new Client()
    const output = client.toHash(data);
    it('should return the hash of data', function(){
        assert.equal(EthCrypto.hash.keccak256(data), output);
    });
})

// Uncomment these tests after passing the previous tests
// describe('Wallet', function() {
//     const client = new Client()
//     const wallet = client.wallet;
//     it('should set this.wallet', function(){
//         assert(wallet)
//     });
//     it('should set this.wallet using createIdentity()', function() {
//         assert(wallet.address && wallet.publicKey && wallet.privateKey)
//     });
// })

// Uncomment these tests after passing the previous tests
// describe('Digital Signatures', function() {
//     const client = new Client()
//     const message = Math.random()
//     const signature = EthCrypto.sign(
//         client.wallet.privateKey,
//         EthCrypto.hash.keccak256(message)
//     )
//     it('should set successfully sign messages', function() {
//         assert.equal(
//             client.sign(message),
//             signature
//         )
//     });
// })

// Uncomment these tests after passing the previous tests
// describe('Verify Signatures', function () {
//     let Alice,
//         Bob,
//         Kevin,
//         message,
//         signature
//     beforeEach(() => {
//         message = Math.random()
//         Alice = new Client()
//         Bob = new Client()
//         Kevin = new Client()
//         signature = Alice.sign(message)
//     });

//     it('should be considered valid', function () {
//         assert(Kevin.verify(
//             signature,
//             EthCrypto.hash.keccak256(message),
//             Alice.wallet.address
//         ))
//     });
//     it('should be considered invalid', function () {
//         assert(!Kevin.verify(
//             signature,
//             EthCrypto.hash.keccak256(message),
//             Bob.wallet.address
//         ))
//     });
// });
