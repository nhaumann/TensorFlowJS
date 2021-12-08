import * as tf from '@tensorflow/tfjs-node'

export const ElementwiseOperations = () =>{

    let data = tf.tensor([1, 2, 3]);
    let otherData = tf.tensor([4, 5, 6])
    const multiDimTensor = tf.tensor([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
    ])

    //Data and otherData are never modified.
    const elementwiseAddedData = data.add(otherData);
    const elementwiseSubtractedData = data.sub(otherData);
    const elemenwiseMulData = data.mul(otherData);

    //..Etc. <, >, div, etc.

    //cannot do any of this if shapes don't match!
    //works well on all different tensor shapes.

    //there are some cases where you can use these operations even if shapes don't match:

    data = tf.tensor([1, 2, 3])
    otherData = tf.tensor([10])

    data.mul(otherData)

    //only works when the shapes, from right to left, are equal or have a value of 1.
    //[2, 3] - [2, 1] ? Works! [2, 3] - [2, 2]? No!
    //[2, 3, 2] - [3, 1]? Yes! 
    //you kinda like... smear the tensor over the other one. Slap it onto the first column, then smeeeaaarrrr it over the rest of em.

    //To print the array data as an array:
    // multiDimTensor.print()

    //to get data from tensor:
    const fifthElement =  multiDimTensor.dataSync()[5];

    //To get row from tensors
    const shape = multiDimTensor.shape;
    const mySlice = multiDimTensor.slice([0, 1], [-1, 1]) //row 0, col1 is our start position. Size? we want up to and including last row, width of 1. If wanted 4 rows, write 4.


    //to concat tensors, use concat.

    otherData = tf.tensor([
        [100, 200, 300]
    ])

    const rowWiseConcat = multiDimTensor.concat(otherData)
    //But this doesn't put them on the same row... it adds rows and makes the new tensor have the sum of rows. This can be changed with second rgument

    otherData = tf.tensor([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
    ]).mul(tf.tensor([100]))
    const colWiseConcat = multiDimTensor.concat(otherData, 1)


    // rowWiseConcat.print();
    // colWiseConcat.print();

    //The axis system means do things along that axis. Imagine an arrow running parallel to the edge of the axis.


    //Summing values along axis!

    //jump1, 2, 3
    const jumpData = [
        [70, 70, 84],
        [70, 70, 84],
        [70, 70, 84],
        [70, 70, 84],
    ]
    //ID : height
    const playerData = [
        [1, 120],
        [2, 154],
        [3, 120],
        [4, 154],
    ]

    const jumpDataTensor = tf.tensor(jumpData)
    const playerDataTensor = tf.tensor(playerData)

    const summedRows = jumpDataTensor
    .sum(1) //Sum along axis 1 sums each player's jump distance. It sums the elements in the row. Our shape is now a 1d tensor... uh oh! It's a 1d tensor of sums of other dimension! Second bool makes it retain shape. Can also reshape.
    .reshape([-1, 1]) //-1 means "calculate this so that the total size remains the same."
    .concat(playerDataTensor, 1);

    summedRows.print()
}
