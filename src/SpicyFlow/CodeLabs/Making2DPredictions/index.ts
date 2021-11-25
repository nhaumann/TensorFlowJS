import * as CarService from "./CarService"
import * as tf from '@tensorflow/tfjs-node'
import { Car } from "./types";
import { Tensor1D } from "@tensorflow/tfjs-node";

export const Make2DPrediction = async () => {

     const carData = await CarService.GetCarData()

     const model = CreateModel();
     const preparedModelData = PrepareData(carData);

     const trainedModel = await TrainModel(model, preparedModelData.inputs, preparedModelData.labels);
     console.log("Done training")

        const xs = tf.linspace(0, 1, 100);
        const preds = model.predict(xs.reshape([100, 1])) as Tensor1D;
        const unNormXs = xs
        .mul(preparedModelData.inputMax.sub(preparedModelData.inputMin))
        .add(preparedModelData.inputMin);
  
      const unNormPreds = preds
        .mul(preparedModelData.labelMax.sub(preparedModelData.labelMin))
        .add(preparedModelData.labelMin);

    const predicted = Array.from(unNormPreds.dataSync())

    const predictedValues = Array.from(unNormXs.dataSync()).map((value, i) =>{
        return {
            horsepower: value,
            mpg: predicted[i]
        }
    }).sort((a, b) => a.horsepower > b.horsepower? 1 : a.horsepower < b.horsepower? -1 : 0)

    const originalValues = carData.sort((a, b) => a.horsepower > b.horsepower? 1 : a.horsepower < b.horsepower? -1 : 0)

    console.table(originalValues)
    console.table(predictedValues)

}

const TrainModel = (model: tf.Sequential, inputs: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>) =>{
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
      });

    const batchSize = 90;
    const epochs  = 250;
     return model.fit(inputs, labels, 
        {
            batchSize,
            epochs,
            shuffle: true,
        })

}

const CreateModel = () =>{
        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1], units: 1}))
        model.add(tf.layers.dense({activation: 'relu', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'elu', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'linear', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'mish', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'relu6', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'selu', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'softmax', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'softplus', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'softmax', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'softsign', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'swish', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'tanh', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({activation: 'relu', units: 5}))
        model.add(tf.layers.dense({units: 5}));
        model.add(tf.layers.dense({units: 1}));
        return model;
}

const PrepareData = (data: Car[]) =>
    tf.tidy(() =>{
        tf.util.shuffle(data); //Because we want to avoid any patterns that could be built into the dataset. Far less likely that a random pattern may arise that the training model may attach to.
        
        const inputs = data.map(d => d.horsepower)
        const labels = data.map(d => d.mpg)

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]) //Is this because we always need an additional constant value for bias? Otherwise we're short by a degree of freedom for our bias?

        //We probably need to use tensor mth functions to take advantage of faster processing provided by their library's bindings.
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        //Normalize values! (val - min)/(max - min). Is partially normal good enough? Why is a range of 1 best? Why not divide by max and get, say, a range of 0.5 to 1? Why is 0 to 1 special? why normalize at all? This surely is meaningless for one-dimension?
        //As suspected, normalization is meaningless here because there is only one scale. 
        //Normalization is required when you have input values on *different* scales, such as age and income. 
        //Normalization prevents the weighting of one dimension over another based on scale of values.
        //https://medium.com/@urvashilluniya/why-data-normalization-is-necessary-for-machine-learning-models-681b65a05029
        //According to Tensorflow documentation, the models are also designed for not-too-big of numbers. Possibly, for optimization, using only a byte at a time (it's possible in C, if you're reading this Nick!)
        //https://www.tutorialspoint.com/cprogramming/c_bit_fields.htm
        const normalInput = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalInput,
            labels: normalLabels,
            inputMax,
            inputMin,
            labelMax,
            labelMin,
          }
    })