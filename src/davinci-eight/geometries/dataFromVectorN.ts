import { Geometric2 } from '../math/Geometric2';
import { Geometric3 } from '../math/Geometric3';
import { Vector2 } from '../math/Vector2';
import Vector3 from '../math/Vector3';
import { VectorN } from '../math/VectorN';

/**
 * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
 * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
 */
export default function dataFromVectorN(source: VectorN<number>): number[] {
    if (source instanceof Geometric3) {
        const g3 = <Geometric3>source;
        return [g3.x, g3.y, g3.z];
    }
    else if (source instanceof Geometric2) {
        const g2 = <Geometric2>source;
        return [g2.x, g2.y];
    }
    else if (source instanceof Vector3) {
        const v3 = <Vector3>source;
        return [v3.x, v3.y, v3.z];
    }
    else if (source instanceof Vector2) {
        const v2 = <Vector2>source;
        return [v2.x, v2.y];
    }
    else {
        // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
        return source.coords;
    }
}
