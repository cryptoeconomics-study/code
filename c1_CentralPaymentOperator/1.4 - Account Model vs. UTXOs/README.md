> If you haven't already, set up your local clone of the `/code` repo by following our [Installation Instructions](https://www.burrrata.ch/ces-website/docs/en/sync/dev-env-setup)

## Paypal with UTXOs

We’re not going to write a function to generate TXOs, since it’s not actually too easy. If we want a transaction spending two inputs from Alice and Bob to one output, we will need signatures from both Alice and Bob, which will require some communication between clients. To make things easier, we’ll be generating transactions outputs for you. 

Re-write the `applyTransaction` method accepting the state of `Paypal.js` so that it will:

* Throw an error if the transaction does not include valid signatures in `sigs` for every owner of the `inputs` 
* Throw an error if the total value of `outputs` is not equal to the total value of `inputs`
* Throw an error if any of the `inputs` are already spent.
* All outputs are added to the state as `unspent` and all inputs are set to `spent`

## Format Guide

### Example state

```
{  
    txOutputs: [
        {
            value: 1000,
            owner: 0x123,
        },
        {
            value: 500,
            owner: 0xabc,
        },
        {
            value: 500,
            owner: 0xdef,
        }
    ], 
    isSpent: [1, 0, 0]
}
```
The values of the isSpent array correspond to each TX in the txOutputs array. 1 = spent, 0 = unspent.

### Transaction format
```
{
  contents: {
    list of inputs,
    list of outputs
  },
  list of input signatures
}

```

**Example TX**

```
{  
    contents: {
        inputs: [1, 2],
        outputs: [
            {value: 250, owner: 0xabc},
            {value: 250, owner: 0x123},
            {value: 500, owner: 0x456}
        ]
    }, 
    sigs: [
        signature1,
        signature2
    ]
}
```
The elements in the `inputs` array correspond to the index in the `txOutputs` array of the `state`. In this example, inputs 1 and 2 correspond to `txOutputs[1]` and `txOutputs[2]`

## Completion

Our UTXO experiment is complete! It's important to understand the UTXO model even though it's a bit less intuitive - it's used by **Bitcoin**, currently the most valuable cryptocurrency by market capitalization. However, for the rest of the course we'll be using the account model, which is used by other blockchains like Ethereum. 


