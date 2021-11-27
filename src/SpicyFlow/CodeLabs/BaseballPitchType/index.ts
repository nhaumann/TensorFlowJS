import * as BaseballService from './BaseballService'
import { PitchDataSet, PitchInformation } from './types';

import * as tf from '@tensorflow/tfjs-node'

let pitchDataTrainingSet: PitchDataSet;
let pitchDataEvaluationSet: PitchDataSet;
let model: tf.Sequential

const TRAINING_SET_FRACTION = 0.9;

export const PredictPitchType = async () => {

    const pitchData = await BaseballService.GetPitchData();
    const evalSet = pitchData.slice(0, Math.floor((1 - TRAINING_SET_FRACTION) * pitchData.length))
    const trainingSet = pitchData.slice(Math.floor((1 - TRAINING_SET_FRACTION) * pitchData.length))

    pitchDataTrainingSet = new PitchDataSet(trainingSet);
    pitchDataEvaluationSet = new PitchDataSet(evalSet);

    model = CreateModel();

    const trainingDatset = tf.data
                             .array(pitchDataTrainingSet.normalPitchData)
                             .map(d => ({
                                 xs: [d.ax, d.ay, d.az, d.left_handed_pitcher, d.start_speed, d.vx0, d.vy0, d.vz0], 
                                 ys: d.pitch_code
                                }))
                             .shuffle(pitchDataTrainingSet.normalPitchData.length)
                             .batch(100);

    const evaluationTensor = tf.tensor(pitchDataEvaluationSet.normalPitchData.map(d => ({
        xs: [d.ax, d.ay, d.az, +d.left_handed_pitcher, d.start_speed, d.vx0, d.vy0, d.vz0], 
        ys: d.pitch_code
       })), [pitchDataEvaluationSet.normalPitchData.length, 1])

    ;(await model.fitDataset(trainingDatset, {epochs: 10})).syncData()

    const predictions = (model.predict(evaluationTensor) as tf.Tensor<tf.Rank>).dataSync()

    for(const prediction of predictions){
        const value = (prediction as number)
        console.log(value)
    }
}

const CreateModel = () =>{
const model = tf.sequential();
model.add(tf.layers.dense({units: 250, activation: 'relu', inputShape: [8]}));
model.add(tf.layers.dense({units: 175, activation: 'relu'}));
model.add(tf.layers.dense({units: 150, activation: 'relu'}));
model.add(tf.layers.dense({units: pitchDataTrainingSet.NUM_PITCH_CLASSES, activation: 'softmax'}));

model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy']
});

return model;
}
