import { Car, TGoogleCar } from './types'
import fetch from "node-fetch";

export const GetCarData = async (): Promise<Car[]> => {
  const carsDataResponse = await fetch(
    "https://storage.googleapis.com/tfjs-tutorials/carsData.json"
  );

  const data = (await carsDataResponse.json()) as TGoogleCar[];
  return data.map((gc) => new Car(gc)).filter((c) => c.mpg && c.horsepower && c.weight && c.year); //I consider values of 0 to unacceptable as well.
};
