import * as  CarService from './CarService'
import * as tf from '@tensorflow/tfjs-node'
import { Car } from "./types";
import { Tensor1D } from "@tensorflow/tfjs-node";

export const Make2DPrediction = async () => {

    const carData = await CarService.GetCarData()

    await use4DModel(carData);

     //await Use2DModel(carData, model)
}
const use4DModel = async (carData: Car[]) =>{
    const model = CreateModel4DModel();
    const preparedData = PrepareMultiDimensionalData(carData)

    const trainedModel = await Train4DModel(model, preparedData.dataTensor, preparedData.labels)
    console.log("Done training")

    //Create 3 sets of linspaces
    const randomvalues = tf.linspace(0, 1, 300).reshape([100, 3])


    const predictions = model.predict(randomvalues) as tf.Tensor<tf.Rank>

    // const valyeArray = Array.from(randomvalues.dataSync(), )

    // const UNHP = Array.from(randomvalues.mul(preparedData.hpMax - preparedData.hpMin).add(preparedData.hpMin).dataSync())
    // const UNYear = Array.from(yearValues.mul(preparedData.yearMax - preparedData.yearMin).add(preparedData.yearMin).dataSync())
    // const UNWeight = Array.from(weightValues.mul(preparedData.weightMax - preparedData.weightMin).add(preparedData.weightMin).dataSync())
    // const UNPredictions = Array.from(predictions.mul(preparedData.labelMax - preparedData.labelMin).add(preparedData.labelMin).dataSync())

    // const dataSet = UNHP.map((v, i) =>({
    //     horsepower: v,
    //     year: UNYear[i],
    //     weight: UNWeight[i],
    //     mpg: UNPredictions[i]
    // } as Car))

    // console.table(dataSet)
}

const Use2DModel = async (carData: Car[]) =>{
    const model = CreateModel2DModel();
    const preparedModelData = PrepareData(carData);

    const trainedModel = await Train2DModel(model, preparedModelData.inputs, preparedModelData.labels);
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

const Train4DModel = (model: tf.Sequential, inputs: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>) =>{
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
      });

    const batchSize = 90;
    const epochs  = 500;
     return model.fit(inputs, labels, 
        {
            batchSize,
            epochs,
            shuffle: true,
        })

}

const Train2DModel = (model: tf.Sequential, inputs: tf.Tensor<tf.Rank>, labels: tf.Tensor<tf.Rank>) =>{
    model.compile({
        optimizer: tf.train.adam(0.1),
        loss: tf.losses.absoluteDifference,
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

const CreateModel4DModel = () =>{
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [3], units: 3}))
    model.add(tf.layers.dense({activation: 'relu', units: 6}))
    model.add(tf.layers.dense({units: 12}));
    model.add(tf.layers.dense({activation: 'elu', units: 18}))
    model.add(tf.layers.dense({units: 24}));
    model.add(tf.layers.dense({activation: 'linear', units: 30}))
    model.add(tf.layers.dense({units: 36}));
    model.add(tf.layers.dense({activation: 'mish', units: 30}))
    model.add(tf.layers.dense({units: 30}));
    model.add(tf.layers.dense({activation: 'relu6', units: 24}))
    model.add(tf.layers.dense({units: 24}));
    model.add(tf.layers.dense({activation: 'selu', units: 18}))
    model.add(tf.layers.dense({units: 18}));
    model.add(tf.layers.dense({activation: 'softmax', units: 12}))
    model.add(tf.layers.dense({units: 12}));
    model.add(tf.layers.dense({activation: 'softplus', units: 12}))
    model.add(tf.layers.dense({units: 12}));
    model.add(tf.layers.dense({activation: 'softmax', units: 9}))
    model.add(tf.layers.dense({units: 9}));
    model.add(tf.layers.dense({activation: 'softsign', units: 9}))
    model.add(tf.layers.dense({units: 9}));
    model.add(tf.layers.dense({activation: 'swish', units: 6}))
    model.add(tf.layers.dense({units: 6}));
    model.add(tf.layers.dense({activation: 'tanh', units: 6}))
    model.add(tf.layers.dense({units: 6}));
    model.add(tf.layers.dense({activation: 'relu', units: 3}))
    model.add(tf.layers.dense({units: 3}));
    model.add(tf.layers.dense({units: 1}));
    return model;
}

const CreateModel2DModel = () =>{
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

    const PrepareMultiDimensionalData = (data: Car[]) =>
    tf.tidy(() =>{
        tf.util.shuffle(data); //Because we want to avoid any patterns that could be built into the dataset. Far less likely that a random pattern may arise that the training model may attach to.
       
        //normalize all values
        const hpMin = Math.min(...data.map(d => d.horsepower))
        const hpMax = Math.max(...data.map(d => d.horsepower))

        const yearMin = Math.min(...data.map(d => d.year))
        const yearMax = Math.max(...data.map(d => d.year))

        const weightMin = Math.min(...data.map(d => d.weight))
        const weightMax = Math.max(...data.map(d => d.weight))

        const labelMin = Math.min(...data.map(d => d.mpg))
        const labelMax = Math.max(...data.map(d => d.mpg))

        const normalData = data.map(d => ({
            horsepower: normalize(d.horsepower, hpMin, hpMax),
            year: normalize(d.year, yearMin, yearMax),
            weight: normalize(d.weight, weightMin, weightMax),
            mpg: normalize(d.mpg, labelMin, labelMax)
        } as Car))

        //Proper way to create tensor with 3 dimensions?
        const dataTensor = tf.tensor(normalData.map(d => [d.horsepower, d.weight, d.year]), [normalData.length, 3])

        const labelTensor = tf.tensor2d(normalData.map(d => d.mpg), [normalData.length, 1])

        return {
            dataTensor,
            labels: labelTensor,
            hpMin,
            hpMax,
            yearMin,
            yearMax,
            weightMin,
            weightMax,
            labelMin,
            labelMax
        }
    })


    const normalize = (value: number, min: number, max: number) =>{
        if(!min || !max) return value;

        return (value - min) / (max-min)
    }