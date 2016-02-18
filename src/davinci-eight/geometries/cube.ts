import Simplex from '../geometries/Simplex';
import quadrilateral from '../geometries/quadrilateral';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R2m from '../math/R2m';
import R3m from '../math/R3m';
import VectorN from '../math/VectorN';

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
 */
export default function cube(size = 1): Simplex[] {

    let s = size / 2;

    let vec0 = new R3m([+s, +s, +s]);
    let vec1 = new R3m([-s, +s, +s]);
    let vec2 = new R3m([-s, -s, +s]);
    let vec3 = new R3m([+s, -s, +s]);
    let vec4 = new R3m([+s, -s, -s]);
    let vec5 = new R3m([+s, +s, -s]);
    let vec6 = new R3m([-s, +s, -s]);
    let vec7 = new R3m([-s, -s, -s]);

    let c00 = new R2m([0, 0]);
    let c01 = new R2m([0, 1]);
    let c10 = new R2m([1, 0]);
    let c11 = new R2m([1, 1]);

    let attributes: { [name: string]: VectorN<number>[] } = {};

    attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = [c11, c01, c00, c10];

    // We currently call quadrilateral rather than square because of the arguments.
    let front = quadrilateral(vec0, vec1, vec2, vec3, attributes);
    let right = quadrilateral(vec0, vec3, vec4, vec5, attributes);
    let top = quadrilateral(vec0, vec5, vec6, vec1, attributes);
    let left = quadrilateral(vec1, vec6, vec7, vec2, attributes);
    let bottom = quadrilateral(vec7, vec4, vec3, vec2, attributes);
    let back = quadrilateral(vec4, vec7, vec6, vec5, attributes);

    let squares = [front, right, top, left, bottom, back];

    // TODO: Fix up the opposing property so that the cube is fully linked together.

    return squares.reduce(function(a: Simplex[], b: Simplex[]) { return a.concat(b) }, []);
}
