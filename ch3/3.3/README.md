> Most of the code challenges in this course build upon each other. It's highly recommended that you start from the beginning. However, this challenge can be completed on its own! If you haven't already, get started with our [Installation Instructions](https://cryptoeconomics.study/docs/en/sync/getting-started-development-setup).

> This lesson has been forked from [Chainshot](https://www.chainshot.com/). We highly recommend you check out their [free coding lessons](https://www.chainshot.com/explore) and [affordable online classes](https://www.chainshot.com/classes)!
<br />

# Merkle Trees

Merkle Trees are awesome! They allow us to verify one piece of data is part of a large data structure, without having all of its parts. This means they can be used to check for inconsistencies in all kinds of distributed systems!

For Blockchain, storing transactions as Merkle Trees allows us to look at a block and verify that a transaction was part of that block by only having part of the data set (average case `log(n)` where `n` is the number of leaf nodes).

Let's take a look at an example:


### ABCDEFGHIJ Merkle Tree

In this tree each letter represents a hash, and combining letters represents concatenating hashes and hashing those together.

```
          Root
        /      \
    ABCD        EFGHIJ
     |          /    \
    ABCD     EFGH     IJ
    / \      /   \     |
   AB  CD   EF   GH   IJ
  / \  / \  / \  / \  / \
  A B  C D  E F  G H  I J
```

To prove that the hash `A` is a part of the Merkle Root we don't need to know Hash `C` or `D`, we just need to know Hash `CD`. The necessary proof for `A` is:

```
Hash(Hash(Hash(A + B) + CD) + EFGHIJ)
```
Where we only need to know the hashes `B`, `CD`, and `EFGHIJ` to prove that `A` is in the merkle root.

If you don't understand all of this, don't worry! That's what this lesson is for. You will understand soon and we'll come back to this over the coming stages.

## Combine Two Leaves

Alright, let's build us a Merkle Tree!

The goal here is to take a bunch of "leaves" (the data hashes that make up the bottom layer of the tree) and hash them together two at a time to form a tree-like structure.

### Add a Constructor

First things first, write a **constructor** for our MerkleTree class. This constructor will take two arguments:

1. An array of leaf nodes for the Merkle Tree.
2. A `concat` function which can be used to concatenate two hashes together to form a new hash.

Store both of these arguments on the Merkle Tree instance.

### Constructor

A constructor is a specially named function in a [JavaScript Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Class_declarations) that will be called when an instance is created with `new`.

To add a constructor, simply use the `constructor` keyword as the name of the function within the class.

### Let's get to the Root

Now we need to add a function `getRoot` to our class that allows us to find the merkle root.

For this stage the only test case setup is taking two roots and hashing them together. Our tree will look like this:

```
    Root
    /  \
   A    B
```
Where `A` and `B` are our leaf hashes and the root is the combined hash.

We'll simply need to take our two leaf hashes and combine them using the `concat` function passed into the MerkleTree constructor. This function expects two arguments, the left and right leaf node.

On the next stage we'll move onto some more in-depth scenarios.

### Concat Function

To simplify this merkle tree implementation and to make debugging easier, we'll pass a concatenation function from the tests into the MerkleTree constructor.

This is the function that combines two leaf nodes and hashes them together. For instance in a four-leaf tree:

```
    Root
    / \
   AB  CD
  / \  / \
  A B  C D
```

This function is used three times, for each combination. I'll write it here as `Hash`:

`Hash(Hash(A + B) + Hash(C + D))`

> If you deep dive into the test cases you'll notice that we can even use the concatenation function to determine the hashing path you used (in the format shown above) to help with debugging in the next few steps.

## Multiple Layers

Awesome! Now it's time to create a larger Merkle Tree.

### Four Leaf Tree

Now we need to make sure to handle a case where there are multiple layers of hashing. First we hash together `A` and `B`, then we hash together `C` and `D`. Then we hash together the combination of `A` and `B` (`AB`) with the combination of `C` and `D` (`CD`). Something like this:

```
    Root
    /  \
   AB  CD
  / \  / \
  A B  C D
```

To do this is may be useful to think of the tree as having multiple layers, where the first layer is the leaves (`A`, `B`, `C`, `D`) the second is the combination of both of those branches (`AB`, `CD`) and then we reach our Merkle Root or the combination of all branches (`ABCD`).

It may be helpful to rememberwhat we're trying to accomplish by hashing at multiple layers.

This is a tough algorithm to work through.

## The Goal

**What's the goal of writing a tree structure of hash combinations?**

Consider the four leaf example:

```
    Root
    /  \
   AB  CD
  / \  / \
  A B  C D
```

Because `CD` is a combination of `C` and `D` and the `Root` is a combination of `AB` and `CD`, we can see that the hash `C` will directly affect the resulting hash in the `Root`. From `C`'s perspective all we need to know is `D` and `AB` to create the `Root`:

```
Hash(AB, Hash(C, D)) == Root
```

Notice that, in this equation, we can completely forget about `A` and `B`. We don't need to know what they are to prove that `C` is in the `Root`. We just need the hashes `D` and `AB`.

This optimization is the power of Merkle Trees and it becomes even more apparent with larger trees where less data is necessary to prove that a leaf node is part of the tree.

## Recommended Approach

There's a few ways to attempt writing this algorithm. The most elegant solutions are likely recursive. This doesn't necessarily mean that you can't attempt it iteratively! Either way, let's break down the thought process on how to approach this.

We have a merkle tree with some arbitrary number of leaf nodes. Maybe it's the four leaf tree:

```
    Root
    /  \
   AB  CD
  / \  / \
  A B  C D
```

Maybe it's the eight leaf tree:

```
        Root
       /    \
    ABCD     EFGH
    / \      / \
   AB  CD   EF  GH
  / \  / \  / \ / \
  A B  C D  E F G H
```

Our recommended approach to this problem, is to break it down into layers. For each layer, we want to go through every 2 nodes and concatenate them.

So, if we're on the bottom layer, we want to take `A` and `B` and concatenate them to make `AB`, `C` and `D` to make `CD` and so on until we have four nodes `AB`, `CD`, `EF`, `GH`.

Once we've done that, we'll move up to the next layer and do the same. Concatenate `AB` and `CD` to get `ABCD`. Concatenate `EF` and `GH` to make `EFGH`.

We'll repeat this one more time, for the last layer to get our merkle root `ABCDEFGH`.

We could preemptively calculate how many layers we need to reduce, or we could keep an array of nodes and when it's `length` is one we know we've reached the merkle root.

It's up to you how to solve it. Make sure you consider the algorithm for each layer as well as your exit condition carefully!

## Odd Leaves

Great! Now we can build large merkle trees. But, can we build them with an odd number of leaves?

### Three Leaf Tree

Now let's consider what happens in the case of an odd number of leaves in a tree. Any time that there is no right side of the particular branch, we're just going to want to carry the hash one layer up:

```
    Root
    / \
   AB  C
  / \  |
  A B  C
```

In this case we don't use the `C` hash until we hash it together with `AB` to create the Merkle Root. Let's handle this in our test cases.

## Other Odd Trees

The rule for odd trees is always to use up everything towards the left side before filling out the right side of the tree.

### Five Leaf Tree

With five leaves, we use the first four as the left side and bring the fifth hash all the way up until the last combination.

```
      Root
     /    \
    ABCD   E
    / \    |
   AB  CD  E
  / \  / \ |
  A B  C D E
```

### Seven Leaf Tree

With seven leaves, the last three hashes work similar to a three leaf tree to build up the `EFG`  combination and then combines with the first four hashes.

```
        Root
       /    \
    ABCD     EFG
    / \      / \
   AB  CD   EF  G
  / \  / \  / \ |
  A B  C D  E F G
```

## Build The Proof

Alright, now it's time to build the proof that a particular leaf node exists within a merkle tree!

With this proof, we'll only want to include the necessary hashes we need to create the root hash from our target leaf node.

## Add the getProof Method

Let's add a `getProof` method to our Merkle Tree, this function will take in an index of a leaf node and give us back a merkle proof, which is the minimum necessary hashes we'll need to prove the leaf node belongs in the tree.

### Recommended Approach

This is a difficult algorithm to come up with, so we've included a recommended approach.

You'll want to approach this similar to how you did the `getRoot` algorithm. If you think of the algorithm in terms of layers, we can figure out what need to do on each layer.

Let's use the ABCDE Merkle Tree for an example:

```
      Root
     /   \
   ABCD   E
   / \    |
  AB  CD  E
 / \  / \ |
 A B  C D E
```

Let's say we want to prove C exists in the tree. We're given the index 2, which corresponds to the C's position in the array passed into our Merkle Tree constructor.

So we start at `C` on the bottom layer. What do we need to first?

We need to know if `C` is the left or right node in its pairing. We can determine this by checking `C`'s index (2). Two is even so it is a left node. Now that we know that, we need to add one to our index to get the right node: `D`. We add `D` to our proof and say it is `left: false` (because it's on the right).

Our proof so far: `[{ data: 'D', left: false }]`

Next we need to move up a layer. Since we started at `C` and we have `D` in our proof, we have what we need to make hash `CD`. That means we want to go from our current index 2, to index 1. Since our merkle tree is a binary tree, each layer concatenates its pairs to result in half the number of leaf nodes (with the exception of the odd node). This means we can divide our current index by 2 and take the floor of it. (`Math.floor(2/2)` which is 1).

So now we move to index 1 on the second layer, which is `CD`. We need to again check if `CD` is a left or right node. Since it's an odd number, it's a right node. We'll subtract one to get it's left node `AB` and add it to our proof:

Our proof so far: `[{ data: 'D', left: false }, { data: 'AB', left: true }]`

If we repeat this pattern, we'll divide our index (1) by 2, take the floor (0) and be at `ABCD`. We'll grab the right node `E` and add that to our proof:

```
[
 { data: 'D', left: false },
 { data: 'AB', left: true },
 { data: 'E', left: false }
]
```

And we're done!

### ABCDE Merkle Tree Example

```
      Root
     /    \
    ABCD   E
    / \    |
   AB  CD  E
  / \  / \ |
  A B  C D E
```

**Proof of C**

To Prove `C` can build the Merkle Root, we can look at the path we need to take to hash up to the root:

```
Hash(Hash(AB + Hash(C + D)) + E)
```

So the four hashes in use here are `AB`, `C`, `D`, and `E`. Since we're starting with `C`, we don't need that node in the proof. We'll need to know the hashes `AB`, `D` and `E`.

Also (and this is important!) we need to know the order in which they should be hashed. `Hash(A + B)` will not be the same as `Hash(B + A)`. Our proof should contain the `data` (the hash) and whether or not the node is in the `left` position.

Our resulting proof would look like this:

```
[
 { data: 'D', left: false },
 { data: 'AB', left: true },
 { data: 'E', left: false }
]
```

By looking at that proof, we can easily concatenate to the root. We start with `C`, concatenate `D` on the right (`CD`), concatenate `AB` to the left (`ABCD`) and then concatenate `E` on the right to get the root `ABCDE`.

Look at that! We didn't even need to know `A` or `B`, just the combined hash of the two.

## Another Example

Let's prove A belongs in the ABCDEFGHIJ Merkle Tree
```
                Root
              /      \
      ABCDEFGH        IJ
      /      \         |
    ABCD     EFGH     IJ
    / \      /   \     |
   AB  CD   EF   GH   IJ
  / \  / \  / \  / \  / \
  A B  C D  E F  G H  I J
```

In order to prove A is in this tree we'll need the following proof path:

```
Hash(Hash(Hash(Hash(A + B) + CD) + EFGH) + IJ)
```

So we'll need four hashes: `B`, `CD`, `EFGH`, and `IJ`.

```
[
 { data: 'B', left: false },
 { data: 'CD', left: false },
 { data: 'EFGH', left: false }
 { data: 'IJ', left: false }
]
```

Such a big tree and we only need four hashes to prove `A`! For `I` or `J` the savings would be even better in this tree, only two hashes necessary for their proofs. Very cool!

## Example Proof

In the previous section we used the `ABCDE` merkle tree and created a proof of `C` being in the tree.

### ABCDE Merkle Tree

```
      Root
     /    \
    ABCD   E
    / \    |
   AB  CD  E
  / \  / \ |
  A B  C D E
```

**Proof of C**

As we said in the previous stage, the hash path is as follows:

```
Hash(Hash(AB + Hash(C + D)) + E)
```

In order to verify this proof then we need to take three steps:

1. Hash `C` and `D`
2. Hash the result together with `AB` (prepend it)
3. Hash the result together with `E` (append it)

After this is complete, our resulting hash is our merkle root: `ABCDE`.


## Verifying your Proof

Almost done! Remember that proof that we just made in the last stage? It's time to verify it. The test cases will include some valid proofs and some invalid proofs, your algorithm will need to know the difference.

**The `verifyProof` Function**

In your `verify.js` file there is a the stub of `verifyProof` function. This function will take four parameters: `proof`, `node`, `root` and `concat`. Here are their definitions:

1. `proof` - The proof we created in the previous stage. It's an array of objects containing the `data` and whether or not the node is in the `left` position.
2. `node` - The node we're trying to prove is within the merkle tree. If, along with the proof data, it can be concatenated to form the merkle root then the proof is valid!
3. `root` - A **buffer** that is the resulting merkle root from the concatenation of all the leaf nodes in the merkle tree.
> The [Node JS Buffer Class](https://nodejs.org/api/buffer.html#buffer_class_buffer) allows us to easily interact with binary data. To compare buffers we can use the `.equals()` [method](https://nodejs.org/api/buffer.html#buffer_buf_equals_otherbuffer).

4. `concat` - The method used to concatenate the leaf nodes. The returned value is a **buffer**.

Once you have concatenated all the nodes together, you can compare it to the `root` node with the `.equals()` [method](https://nodejs.org/api/buffer.html#buffer_buf_equals_otherbuffer).

> As always, if you have questions or get stuck please hit up the community on the [forum!](https://forum.cryptoeconomics.study)
