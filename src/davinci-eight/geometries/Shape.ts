import Path from '../geometries/Path';

export default class Shape extends Path {
    holes: Path[]
    constructor() {
        super()
        this.holes = []
    }
}
