import GridSimplexGeometry from '../geometries/GridSimplexGeometry';
import R3 from '../math/R3';

let cos = Math.cos;
let sin = Math.sin;
let pi = Math.PI;

function mobius(u: number, v: number): R3 {
    var point = new R3([0, 0, 0]);
    /**
     * radius
     */
    var R = 1;
    /**
     * half-width
     */
    var w = 0.05;

    var s = (2 * u - 1) * w; // [-w, w]
    var t = 2 * pi * v;     // [0, 2pi]

    point.x = (R + s * cos(t / 2)) * cos(t);
    point.y = (R + s * cos(t / 2)) * sin(t);
    point.z = s * sin(t / 2);
    return point;
}

export default class MobiusStripSimplexGeometry extends GridSimplexGeometry {
    constructor(uSegments: number, vSegments: number) {
        super(mobius, uSegments, vSegments);
    }
}
