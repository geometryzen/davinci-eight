import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import triangle = require('../dfx/triangle');
import VectorN = require('../math/VectorN');

function setAttributes(which: number[], source: { [name: string]: VectorN<number>[] }, target: { [name: string]: VectorN<number>[] }) {
  let names: string[] = Object.keys(source);
  let namesLength: number = names.length;
  let i: number;
  var name: string;
  var values: VectorN<number>[];
  for (i = 0; i < namesLength; i++) {
    name = names[i];
    values = source[name];
    target[name] = which.map(function(index: number) { return values[index]; });
  }
}

// quad
//
//  b-------a
//  |       | 
//  |       |
//  |       |
//  c-------d
//
function quad(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {

  expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
  expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
  expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
  expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");

  let triatts: { [name: string]: VectorN<number>[] } = {};

  setAttributes([0, 1, 2], attributes, triatts);
  triangle(a, b, c, triatts, triangles);

  setAttributes([0, 2, 3], attributes, triatts);
  // For symmetry this would be nice to be c-d-a and 2-3-0
  triangle(a, c, d, triatts, triangles);

  return triangles;
}

export = quad;
