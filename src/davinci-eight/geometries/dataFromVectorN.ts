import G3 = require('../math/G3')
import R2 = require('../math/R2')
import R3 = require('../math/R3')
import VectorN = require('../math/VectorN')

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers fo vertex attributes, but allows us to extract the vector (grade-1) part?
 */
function dataFromVectorN(source: VectorN<number>): number[] {
    if (source instanceof G3) {
        let g3 = <G3>source
        return [g3.x, g3.y, g3.z]
    }
    else if (source instanceof R3) {
        let v3 = <R3>source
        return [v3.x, v3.y, v3.z]
    }
    else if (source instanceof R2) {
        let v2 = <R2>source
        return [v2.x, v2.y]
    }
    else {
        // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
        return source.coords
    }
}

export = dataFromVectorN