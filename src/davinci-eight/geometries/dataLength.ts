import G3 = require('../math/G3')
import R2 = require('../math/R2')
import R3 = require('../math/R3')
import VectorN = require('../math/VectorN')

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers fo vertex attributes, but allows us to extract the vector (grade-1) part?
 */
function dataLength(source: VectorN<number>): number {
    if (source instanceof G3) {
        return 3
    }
    else if (source instanceof R3) {
        if (source.length !== 3) {
            throw new Error("source.length is expected to be 3")
        }
        return 3
    }
    else if (source instanceof R2) {
        if (source.length !== 2) {
            throw new Error("source.length is expected to be 2")
        }
        return 2
    }
    else {
        // console.warn("dataLength(source: VectorN<number>): number[], source.length => " + source.length)
        return source.length
    }
}

export = dataLength