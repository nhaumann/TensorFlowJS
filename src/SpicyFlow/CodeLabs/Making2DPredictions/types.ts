export class Car {
    mpg: number
    horsepower: number
    year: number
    weight: number

    constructor(googleCar: TGoogleCar){
        this.mpg = googleCar.Miles_per_Gallon
        this.horsepower = googleCar.Horsepower
        this.year = googleCar.Year
        this.weight = googleCar.Weight_in_lbs
    }
}

export type TGoogleCar = {
    Miles_per_Gallon: number
    Horsepower: number
    Year: number
    Weight_in_lbs: number
}