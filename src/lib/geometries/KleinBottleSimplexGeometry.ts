import { GridSimplexBuilder } from "../geometries/GridSimplexBuilder";
import { Vector3 } from "../math/Vector3";

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
function klein(u: number, v: number): Vector3 {
    const point = new Vector3();

    u = u * 2 * pi;
    v = v * 2 * pi;

    if (u < pi) {
        point.x = 3 * cos(u) * (1 + sin(u)) + 2 * (1 - cos(u) / 2) * cos(u) * cos(v);
        point.z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v);
    } else {
        point.x = 3 * cos(u) * (1 + sin(u)) + 2 * (1 - cos(u) / 2) * cos(v + pi);
        point.z = -8 * sin(u);
    }
    point.y = -2 * (1 - cos(u) / 2) * sin(v);
    return point.scale(0.1);
}

/**
 * @hidden
 */
export class KleinBottleSimplexGeometry extends GridSimplexBuilder {
    constructor(uSegments: number, vSegments: number) {
        super(klein, uSegments, vSegments);
    }
}
