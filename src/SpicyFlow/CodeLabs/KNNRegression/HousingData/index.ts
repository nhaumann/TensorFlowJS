import * as tf from '@tensorflow/tfjs-node'
import csv from 'csvtojson'
import { THousingData, THousingDataCSV } from './types';

const testSize = 10;

export const HousingKNNAnalysis = async () =>{
    let data = await csv().fromFile('Data/kc_house_data.csv') as THousingDataCSV[];

    tf.util.shuffle(data)

    const csvData = data.map(data => ({price: Number.parseFloat(data.price), lat: Number.parseFloat(data.lat), long: Number.parseFloat(data.long)}) as THousingData)

    const testData = csvData.slice(0, testSize)
    const trainData = csvData.slice(testSize)

    let trainFeatures = tf.tensor(trainData.map(td => [td.lat, td.long]))
    let testFeatures = tf.tensor(testData.map(td => [td.lat, td.long]))
    let trainLabels = tf.tensor(trainData.map(td => [td.price]))
    let testLabels = tf.tensor(testData.map(td => [td.price]))

    console.log(testFeatures)

    // const predictionPoint = tf.tensor([47, -122])

    const point = testFeatures.unstack()[0]
    const actualPrice = testLabels.unstack()[0].dataSync()[0]

    const predictedPrice = knnAnalysis(trainFeatures, trainLabels, point, 5)

    console.log(`Predicted value: $${predictedPrice}\nActual Price: $${actualPrice}\n`)
}


const knnAnalysis  = (features: tf.Tensor, labels: tf.Tensor, predictionPoint: tf.Tensor, k: number) =>{
   return features
    .sub(predictionPoint)
    .pow(2)
    .sum(1)
    .sqrt()
    .reshape([-1, 1])
    .concat(labels, 1)
    .unstack()                                        
    .map(tensor => tensor.dataSync())                 
    .sort((a, b) => a[0] > b[0]? 1 : -1)              
    .slice(0, k)                                    
    .map(row => row[1])                               
    .reduce((prev, next) => prev += next, 0) / k
}