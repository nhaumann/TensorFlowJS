import * as tf from '@tensorflow/tfjs-node'

export const PredictHousePrice = (x: number, y: number) =>{

    const predictionPoint = [x, y]
    const k = 2;
    const features = [
        [84, 83],
        [84.1, 85],
        [84.2, 84],
        [84.3, 83.5],
        [85, 83.6]
    ]

    const labels = [
        [200],
        [250],
        [240],
        [215],
        [210]
    ]

    const latlongTensor = tf.tensor(features);
    const labelsTensor = tf.tensor(labels)

    //Get distance:
    const predictedPrice = latlongTensor
    .sub(predictionPoint)                             //Subtracts along axis 0
    .pow(2)                                           //Squares each value!
    .sum(1)                                           //Sum along row - destroys shape.
    .sqrt()                                           //square root of each value
    .reshape([-1, 1])                                 //reshape to match labels shape
    .concat(labelsTensor, 1)
    .unstack()                                        //Separate into many individual tensors
    .map(tensor => tensor.dataSync())                 //Get data for each tensor
    .sort((a, b) => a[0] > b[0]? 1 : -1)              //Sort tensors by first value in array (distance)
    .slice(0, k)                                      //Get top k values
    .map(row => row[1])                               //map to price label
    .reduce((prev, next) => prev += next, 0) / k      //Reduce to get sum, then divide by k to get average

    console.log(predictedPrice)


}
