import G2m from '../math/G2m';
import G3m from '../math/G3m';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import VectorN from '../math/VectorN';

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
export default function dataFromVectorN(source: VectorN<number>): number[] {
    if (source instanceof G3m) {
        const g3 = <G3m>source
        return [g3.x, g3.y, g3.z]
    }
    else if (source instanceof G2m) {
        const g2 = <G2m>source
        return [g2.x, g2.y]
    }
    else if (source instanceof Vector3) {
        const v3 = <Vector3>source
        return [v3.x, v3.y, v3.z]
    }
    else if (source instanceof Vector2) {
        const v2 = <Vector2>source
        return [v2.x, v2.y]
    }
    else {
        // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
        return source.coords
    }
}
