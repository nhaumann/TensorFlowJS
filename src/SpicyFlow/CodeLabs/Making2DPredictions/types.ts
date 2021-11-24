export class Car {
    mpg: number
    horsepower: number

    constructor(googleCar: TGoogleCar){
        this.mpg = googleCar.Miles_per_Gallon
        this.horsepower = googleCar.Horsepower
    }
}

export type TGoogleCar = {
    Miles_per_Gallon: number
    Horsepower: number 
}