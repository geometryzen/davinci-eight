import expectArg = require('../checks/expectArg');
import Simplex = require('../geometries/Simplex');
import triangle = require('../geometries/triangle');
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

/**
 * quadrilateral
 *
 *  b-------a
 *  |       | 
 *  |       |
 *  |       |
 *  c-------d
 *
 * The quadrilateral is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 */
function quadrilateral(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {

  expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
  expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
  expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
  expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");

  let triatts: { [name: string]: VectorN<number>[] } = {};

  setAttributes([1, 2, 0], attributes, triatts);
  triangle(b, c, a, triatts, triangles);

  setAttributes([3, 0, 2], attributes, triatts);
  triangle(d, a, c, triatts, triangles);

  return triangles;
}

export = quadrilateral;
