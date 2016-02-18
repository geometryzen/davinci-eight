import G2m from '../math/G2m';
import G3m from '../math/G3m';
import R2m from '../math/R2m';
import R3m from '../math/R3m';
import VectorN from '../math/VectorN';

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
export default function dataLength(source: VectorN<number>): number {
    if (source instanceof G3m) {
        if (source.length !== 8) {
            throw new Error("source.length is expected to be 8")
        }
        return 3
    }
    else if (source instanceof G2m) {
        if (source.length !== 4) {
            throw new Error("source.length is expected to be 4")
        }
        return 2
    }
    else if (source instanceof R3m) {
        if (source.length !== 3) {
            throw new Error("source.length is expected to be 3")
        }
        return 3
    }
    else if (source instanceof R2m) {
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
