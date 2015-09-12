import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

function quad(vecs: Vector3[], coords: Vector2[]): Simplex[] {
  expectArg('vecs', vecs).toBeObject().toSatisfy(vecs.length === 4, "");
  expectArg('coords', coords).toBeObject().toSatisfy(coords.length === 4, "");
  let triangles = new Array<Simplex>();
  let t012 = new Simplex([vecs[0], vecs[1], vecs[2]]);
  Simplex.computeFaceNormals(t012);
  t012.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[0];
  t012.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[1];
  t012.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[2];
  triangles.push(t012);
  let t023 = new Simplex([vecs[0], vecs[2], vecs[3]]);
  Simplex.computeFaceNormals(t023);
  t023.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE] = t012.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE];
  t023.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE] = t012.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE];
  t023.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[3];
  triangles.push(t023);
  return triangles;
}

export = quad;
