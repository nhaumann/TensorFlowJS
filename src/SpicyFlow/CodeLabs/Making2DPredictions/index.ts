import { GetCarData } from "./CarService"

export const Make2DPrediction = async () => {

    const carData = await GetCarData()
    console.table(carData)
}