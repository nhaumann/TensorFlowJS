import { GetCarData } from "./CarService"
import tf from '@tensorflow/tfjs-node'

export const Make2DPrediction = async () => {

    // const carData = await GetCarData()
    // console.table(carData)

    const seqModel = CreateModel();

    console.table(seqModel.summary())
}

const CreateModel = () =>{
        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1], units: 1}))
        model.add(tf.layers.dense({units: 1}))
        return model;
}