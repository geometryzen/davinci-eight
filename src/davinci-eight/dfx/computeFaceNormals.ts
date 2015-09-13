import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
import wedgeXY = require('../math/wedgeXY');
import wedgeYZ = require('../math/wedgeYZ');
import wedgeZX = require('../math/wedgeZX');

function computeFaceNormals(simplex: Simplex): void {
  // TODO: Optimize so that we don't create temporaries.
  // Use static functions on Vector3 to compute cross product by component.
  expectArg('simplex', simplex).toBeObject();
  expectArg('name', name).toBeString();

  // We're going to create a single Vector3 and share it across all vertices
  // so we create it now in order to to make use of the mutators.

  let vertex0 = simplex.vertices[0].attributes;
  let vertex1 = simplex.vertices[1].attributes;
  let vertex2 = simplex.vertices[2].attributes;

  let pos0: VectorN<number> = vertex0[Symbolic.ATTRIBUTE_POSITION];
  let pos1: VectorN<number> = vertex1[Symbolic.ATTRIBUTE_POSITION];
  let pos2: VectorN<number> = vertex2[Symbolic.ATTRIBUTE_POSITION];

  let x0: number = pos0.getComponent(0);
  let y0: number = pos0.getComponent(1);
  let z0: number = pos0.getComponent(2);

  let x1: number = pos1.getComponent(0);
  let y1: number = pos1.getComponent(1);
  let z1: number = pos1.getComponent(2);

  let x2: number = pos2.getComponent(0);
  let y2: number = pos2.getComponent(1);
  let z2: number = pos2.getComponent(2);

  let ax = x2 - x1;
  let ay = y2 - y1;
  let az = z2 - z1;

  let bx = x0 - x1;
  let by = y0 - y1;
  let bz = z0 - z1;

  let x = wedgeYZ(ax, ay, az, bx, by, bz);
  let y = wedgeZX(ax, ay, az, bx, by, bz);
  let z = wedgeXY(ax, ay, az, bx, by, bz);

  let normal = new Vector3([x, y, z]).normalize();

  vertex0[Symbolic.ATTRIBUTE_NORMAL] = normal;
  vertex1[Symbolic.ATTRIBUTE_NORMAL] = normal;
  vertex2[Symbolic.ATTRIBUTE_NORMAL] = normal;
}

export = computeFaceNormals;
