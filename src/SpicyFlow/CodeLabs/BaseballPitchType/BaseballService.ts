import fetch from "node-fetch";
import csv from 'csvtojson';
import { PitchInformation } from "./types";

export const GetPitchData = async () =>{
    const response = await fetch('https://storage.googleapis.com/mlb-pitch-data/pitch_type_test_data.csv')

    const csvText = await response.text()

    const data = Array.from(await csv().fromString(csvText))
    for (const entry of data) {
        for (const key in entry) {
            entry[key] = Number.parseFloat(entry[key])
        }
    }
 
    return data as PitchInformation[];
}

