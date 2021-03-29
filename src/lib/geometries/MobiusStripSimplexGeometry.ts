import { GridSimplexBuilder } from '../geometries/GridSimplexBuilder';
import { Vector3 } from '../math/Vector3';

/**
 * @hidden
 */
const cos = Math.cos;
/**
 * @hidden
 */
const sin = Math.sin;
/**
 * @hidden
 */
const pi = Math.PI;

/**
 * @hidden
 */
function mobius(u: number, v: number): Vector3 {
    const point = new Vector3([0, 0, 0]);
    /**
     * radius
     */
    const R = 1;
    /**
     * half-width
     */
    const w = 0.05;

    const s = (2 * u - 1) * w; // [-w, w]
    const t = 2 * pi * v;     // [0, 2pi]

    point.x = (R + s * cos(t / 2)) * cos(t);
    point.y = (R + s * cos(t / 2)) * sin(t);
    point.z = s * sin(t / 2);
    return point;
}

export class MobiusStripSimplexGeometry extends GridSimplexBuilder {
    constructor(uSegments: number, vSegments: number) {
        super(mobius, uSegments, vSegments);
    }
}
