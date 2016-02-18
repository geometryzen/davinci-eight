import GridBuilder from '../geometries/GridBuilder';
import R3m from '../math/R3m';

let cos = Math.cos;
let sin = Math.sin;
let pi = Math.PI;

function mobius(u: number, v: number): R3m {
    var point = new R3m([0, 0, 0]);
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

export default class MobiusStripSimplexGeometry extends GridBuilder {
    constructor(uSegments: number, vSegments: number) {
        super(mobius, uSegments, vSegments);
    }
}
