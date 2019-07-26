const Client = require('../Client.js')
const EthCrypto = require('eth-crypto')
const assert = require('assert')

// Testing tohash() function to hash random data
describe('Hash', function() {
    const data = Math.random();
    const client = new Client()
    const output = client.toHash(data);
    it('should return the hash of data', function(){
        assert.equal(EthCrypto.hash.keccak256(data), output);
    });
})

// Testing constructor() to initialize this.wallet with EthCrypto.createIdentity()
describe('Wallet', function() {
    const client = new Client()
    const wallet = client.wallet;
    it('should set this.wallet', function(){
        assert(wallet)
    });
    it('should set this.wallet using createIdentity()', function() {
         assert(wallet.address && wallet.publicKey && wallet.privateKey)
    });
})

// Testing sign() function to use this.wallet to sign random data
describe('Digital Signatures', function() {
    const client = new Client()
    const message = Math.random()
    const signature = EthCrypto.sign(
        client.wallet.privateKey,
        EthCrypto.hash.keccak256(message)
    )
    it('should set successfully sign messages', function() {
        assert.equal(
            client.sign(message),
            signature
        )
    });
})

// Testing verify() to check signatures from randomly initialized  wallets
describe('Verify Signatures', function () {
    let Alice,
        Bob,
        Kevin,
        message,
        signature
    beforeEach(() => {
        message = Math.random()
        Alice = new Client()
        Bob = new Client()
        Kevin = new Client()
        signature = Alice.sign(message)
    });

    it('should be considered valid', function () {
        assert(Kevin.verify(
            signature,
            EthCrypto.hash.keccak256(message),
            Alice.wallet.address
        ))
    });
    it('should be considered invalid', function () {
        assert(!Kevin.verify(
            signature,
            EthCrypto.hash.keccak256(message),
            Bob.wallet.address
        ))
    });
});

