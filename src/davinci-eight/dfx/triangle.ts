import computeFaceNormals = require('../dfx/computeFaceNormals');
import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector2 = require('../math/Vector2');
import VectorN = require('../math/VectorN');

function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes: {[name: string]: VectorN<number>[]} = {}, triangles: Simplex[] = []): Simplex[] {

  expectArg('a', a).toBeObject();
  expectArg('b', b).toBeObject();
  expectArg('b', c).toBeObject();

  let simplex = new Simplex([a, b, c]);

  computeFaceNormals(simplex);

  Simplex.setAttributeValues(attributes, simplex);

  triangles.push(simplex);
  return triangles;
}

export = triangle;
