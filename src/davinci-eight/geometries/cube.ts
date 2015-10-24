import Simplex = require('../geometries/Simplex');
import quadrilateral = require('../geometries/quadrilateral');
import Symbolic = require('../core/Symbolic');
import R2 = require('../math/R2');
import R3 = require('../math/R3');
import VectorN = require('../math/VectorN');

function vector3(data: number[]): VectorN<number> {
  return new R3([]);
}

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
function cube(size: number = 1): Simplex[] {

  let s = size / 2;

  let vec0 = new R3([+s, +s, +s]);
  let vec1 = new R3([-s, +s, +s]);
  let vec2 = new R3([-s, -s, +s]);
  let vec3 = new R3([+s, -s, +s]);
  let vec4 = new R3([+s, -s, -s]);
  let vec5 = new R3([+s, +s, -s]);
  let vec6 = new R3([-s, +s, -s]);
  let vec7 = new R3([-s, -s, -s]);

  let c00 = new R2([0, 0]);
  let c01 = new R2([0, 1]);
  let c10 = new R2([1, 0]);
  let c11 = new R2([1, 1]);

  let attributes: { [name: string]: VectorN<number>[] } = {};

  attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = [c11, c01, c00, c10];

  // We currently call quadrilateral rather than square because of the arguments.
  let front  = quadrilateral(vec0, vec1, vec2, vec3, attributes);
  let right  = quadrilateral(vec0, vec3, vec4, vec5, attributes);
  let top    = quadrilateral(vec0, vec5, vec6, vec1, attributes);
  let left   = quadrilateral(vec1, vec6, vec7, vec2, attributes);
  let bottom = quadrilateral(vec7, vec4, vec3, vec2, attributes);
  let back   = quadrilateral(vec4, vec7, vec6, vec5, attributes);

  let squares = [front, right, top, left, bottom, back];

  // TODO: Fix up the opposing property so that the cube is fully linked together.

  return squares.reduce(function(a: Simplex[], b: Simplex[]) { return a.concat(b) }, []);
}

export = cube;