import G2 from '../math/G2';
import G3 from '../math/G3';
import R2 from '../math/R2';
import R3 from '../math/R3';
import VectorN from '../math/VectorN';

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
export default function dataFromVectorN(source: VectorN<number>): number[] {
    if (source instanceof G3) {
        let g3 = <G3>source
        return [g3.x, g3.y, g3.z]
    }
    else if (source instanceof G2) {
        let g2 = <G2>source
        return [g2.x, g2.y]
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
