import computeFaceNormals = require('../geometries/computeFaceNormals');
import expectArg = require('../checks/expectArg');
import Simplex = require('../geometries/Simplex');
import Symbolic = require('../core/Symbolic');
import VectorN = require('../math/VectorN');

function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes: {[name: string]: VectorN<number>[]} = {}, triangles: Simplex[] = []): Simplex[] {

  expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
  expectArg('b', b).toSatisfy(a instanceof VectorN, "a must be a VectorN");
  expectArg('b', c).toSatisfy(a instanceof VectorN, "a must be a VectorN");

  let simplex = new Simplex(Simplex.K_FOR_TRIANGLE);

  simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = a;
  simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = b;
  simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = c;

  computeFaceNormals(simplex, Symbolic.ATTRIBUTE_POSITION, Symbolic.ATTRIBUTE_NORMAL);

  Simplex.setAttributeValues(attributes, simplex);

  triangles.push(simplex);

  return triangles;
}

export = triangle;
