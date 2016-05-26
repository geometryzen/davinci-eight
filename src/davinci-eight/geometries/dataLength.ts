import {Geometric2} from '../math/Geometric2';
import {Geometric3} from '../math/Geometric3';
import {Vector2} from '../math/Vector2';
import Vector3 from '../math/Vector3';
import {VectorN} from '../math/VectorN';

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
export default function dataLength(source: VectorN<number>): number {
    if (source instanceof Geometric3) {
        if (source.length !== 8) {
            throw new Error("source.length is expected to be 8")
        }
        return 3
    }
    else if (source instanceof Geometric2) {
        if (source.length !== 4) {
            throw new Error("source.length is expected to be 4")
        }
        return 2
    }
    else if (source instanceof Vector3) {
        if (source.length !== 3) {
            throw new Error("source.length is expected to be 3")
        }
        return 3
    }
    else if (source instanceof Vector2) {
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
