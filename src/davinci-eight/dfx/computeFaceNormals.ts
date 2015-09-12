import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector3 = require('../math/Vector3');

function computeFaceNormals(simplex: Simplex): void {
  expectArg('simplex', simplex).toBeObject();
  expectArg('name', name).toBeString();
  let vertex0 = simplex.vertices[0];
  let vertex1 = simplex.vertices[1];
  let vertex2 = simplex.vertices[2];
  let vA: Vector3 = new Vector3(vertex0.position.data);
  let vB: Vector3 = new Vector3(vertex1.position.data);
  let vC: Vector3 = new Vector3(vertex2.position.data);
  let cb = new Vector3().subVectors(vC, vB);
  let ab = new Vector3().subVectors(vA, vB);
  let normal = new Vector3().crossVectors(cb, ab).normalize();
  vertex0.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
  vertex1.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
  vertex2.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
}

export = computeFaceNormals;
