export type PitchInformation = {
    ax: number
    ay: number
    az: number
    left_handed_pitcher: boolean
    pitch_code: number
    start_speed: number
    vx0: number
    vy0: number
    vz0: number
}

export class PitchDataSet {

    NUM_PITCH_CLASSES: number = 7
    axMin: number
    axMax: number
    ayMin: number
    ayMax: number
    azMin: number
    azMax: number
    left_handed_pitcher: number
    pitch_code: number
    start_speed: number
    vx0Min: number
    vx0Max: number
    vy0Min: number
    vz0Min: number
    vy0Max: number
    vz0Max: number
    start_speedMin: number
    start_speedMax: number
    pitchData: PitchInformation[] = []
    normalPitchData: PitchInformation[] = []
    length: number = this.normalPitchData.length
    
    public constructor(pitchData: PitchInformation[]){
        this.pitchData = pitchData

        this.axMin = Math.min(...pitchData.map(d => d.ax))
        this.axMax = Math.max(...pitchData.map(d => d.ax))

        this.ayMin = Math.min(...pitchData.map(d => d.ay))
        this.ayMax = Math.max(...pitchData.map(d => d.ay))

        this.azMin = Math.min(...pitchData.map(d => d.az))
        this.azMax = Math.max(...pitchData.map(d => d.az))

        this.vx0Min = Math.min(...pitchData.map(d => d.vx0))
        this.vx0Max = Math.max(...pitchData.map(d => d.vx0))

        this.vy0Min = Math.min(...pitchData.map(d => d.vy0))
        this.vy0Max = Math.max(...pitchData.map(d => d.vy0))

        this.vz0Min = Math.min(...pitchData.map(d => d.vz0))
        this.vz0Max = Math.max(...pitchData.map(d => d.vz0))
       
        this.start_speedMin = Math.min(...pitchData.map(d => d.start_speed))
        this.start_speedMax = Math.max(...pitchData.map(d => d.start_speed))

        for (const object of pitchData) {
            const normalObject = {} as PitchInformation
            for (const key in object) {
                const value = object[key]
                const normalValue = normalize(value, this[`${key}Min`], this[`${key}Max`],)
                normalObject[key] = normalValue
            }

            this.normalPitchData.push(normalObject)
        }

    }
}

function normalize(value, min, max) {
    if (min === undefined || max === undefined) {
      return value;
    }
    return (value - min) / (max - min);
  }