import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector3 = require('../math/Vector3');

function computeFaceNormals(simplex: Simplex): void {
  // TODO: Optimize so that we don't create temporaries.
  // Use static functions on Vector3 to compute cross product by component.
  expectArg('simplex', simplex).toBeObject();
  expectArg('name', name).toBeString();
  let vertex0 = simplex.vertices[0].attributes;
  let vertex1 = simplex.vertices[1].attributes;
  let vertex2 = simplex.vertices[2].attributes;
  let vA: Vector3 = new Vector3(vertex0[Symbolic.ATTRIBUTE_POSITION].data);
  let vB: Vector3 = new Vector3(vertex1[Symbolic.ATTRIBUTE_POSITION].data);
  let vC: Vector3 = new Vector3(vertex2[Symbolic.ATTRIBUTE_POSITION].data);
  let cb = new Vector3().subVectors(vC, vB);
  let ab = new Vector3().subVectors(vA, vB);
  let normal = new Vector3().crossVectors(cb, ab).normalize();
  vertex0[Symbolic.ATTRIBUTE_NORMAL] = normal;
  vertex1[Symbolic.ATTRIBUTE_NORMAL] = normal;
  vertex2[Symbolic.ATTRIBUTE_NORMAL] = normal;
}

export = computeFaceNormals;
