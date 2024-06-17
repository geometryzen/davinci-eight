import { VectorN } from "../atoms/VectorN";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";
import { quadrilateral } from "../geometries/quadrilateral";
import { Simplex } from "../geometries/Simplex";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

// square
//
//  b-------a
//  |       |
//  |       |
//  c-------d
//
/**
 * @hidden
 */
export function square(size = 1): Simplex[] {
    const s = size / 2;

    const vec0 = new Vector3([+s, +s, 0]);
    const vec1 = new Vector3([-s, +s, 0]);
    const vec2 = new Vector3([-s, -s, 0]);
    const vec3 = new Vector3([+s, -s, 0]);

    const c00 = new Vector2([0, 0]);
    const c01 = new Vector2([0, 1]);
    const c10 = new Vector2([1, 0]);
    const c11 = new Vector2([1, 1]);

    const coords: Vector2[] = [c11, c01, c00, c10];

    const attributes: { [name: string]: VectorN<number>[] } = {};

    attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = coords;

    return quadrilateral(vec0, vec1, vec2, vec3, attributes);
}
