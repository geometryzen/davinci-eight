import { VectorN } from '../atoms/VectorN';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { quadrilateral } from '../geometries/quadrilateral';
import { Simplex } from '../geometries/Simplex';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

/**
 * cube as Simplex[]
 *
 *    v6----- v5
 *   /|      /|
 *  v1------v0|
 *  | |     | |
 *  | |v7---|-|v4
 *  |/      |/
 *  v2------v3
 * @hidden
 */
export function cube(size = 1): Simplex[] {

    const s = size / 2;

    const vec0 = new Vector3([+s, +s, +s]);
    const vec1 = new Vector3([-s, +s, +s]);
    const vec2 = new Vector3([-s, -s, +s]);
    const vec3 = new Vector3([+s, -s, +s]);
    const vec4 = new Vector3([+s, -s, -s]);
    const vec5 = new Vector3([+s, +s, -s]);
    const vec6 = new Vector3([-s, +s, -s]);
    const vec7 = new Vector3([-s, -s, -s]);

    const c00 = new Vector2([0, 0]);
    const c01 = new Vector2([0, 1]);
    const c10 = new Vector2([1, 0]);
    const c11 = new Vector2([1, 1]);

    const attributes: { [name: string]: VectorN<number>[] } = {};

    attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = [c11, c01, c00, c10];

    // We currently call quadrilateral rather than square because of the arguments.
    const front = quadrilateral(vec0, vec1, vec2, vec3, attributes);
    const right = quadrilateral(vec0, vec3, vec4, vec5, attributes);
    const top = quadrilateral(vec0, vec5, vec6, vec1, attributes);
    const left = quadrilateral(vec1, vec6, vec7, vec2, attributes);
    const bottom = quadrilateral(vec7, vec4, vec3, vec2, attributes);
    const back = quadrilateral(vec4, vec7, vec6, vec5, attributes);

    const squares = [front, right, top, left, bottom, back];

    // TODO: Fix up the opposing property so that the cube is fully linked together.

    return squares.reduce(function (a: Simplex[], b: Simplex[]) { return a.concat(b); }, []);
}
