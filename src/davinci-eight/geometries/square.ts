import Simplex = require('../geometries/Simplex');
import quadrilateral = require('../geometries/quadrilateral');
import Symbolic = require('../core/Symbolic');
import MutableVectorE2 = require('../math/MutableVectorE2');
import MutableVectorE3 = require('../math/MutableVectorE3');
import VectorN = require('../math/VectorN');

// square
//
//  b-------a
//  |       | 
//  |       |
//  |       |
//  c-------d
//
function square(size: number = 1): Simplex[] {

  let s = size / 2;

  let vec0 = new MutableVectorE3([+s, +s, 0]);
  let vec1 = new MutableVectorE3([-s, +s, 0]);
  let vec2 = new MutableVectorE3([-s, -s, 0]);
  let vec3 = new MutableVectorE3([+s, -s, 0]);

  let c00 = new MutableVectorE2([0, 0]);
  let c01 = new MutableVectorE2([0, 1]);
  let c10 = new MutableVectorE2([1, 0]);
  let c11 = new MutableVectorE2([1, 1]);

  let coords: MutableVectorE2[] = [c11, c01, c00, c10];

  let attributes: { [name: string]: VectorN<number>[] } = {};

  attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = coords;

  return quadrilateral(vec0, vec1, vec2, vec3, attributes);
}

export = square;