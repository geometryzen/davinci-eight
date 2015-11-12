import Simplex = require('../geometries/Simplex');
import Symbolic = require('../core/Symbolic');
import R3 = require('../math/R3');
import VectorN = require('../math/VectorN');
import wedgeXY = require('../math/wedgeXY');
import wedgeYZ = require('../math/wedgeYZ');
import wedgeZX = require('../math/wedgeZX');

function computeFaceNormals(simplex: Simplex, positionName = Symbolic.ATTRIBUTE_POSITION, normalName = Symbolic.ATTRIBUTE_NORMAL): void {
  let vertex0 = simplex.vertices[0].attributes;
  let vertex1 = simplex.vertices[1].attributes;
  let vertex2 = simplex.vertices[2].attributes;

  let pos0: VectorN<number> = vertex0[positionName];
  let pos1: VectorN<number> = vertex1[positionName];
  let pos2: VectorN<number> = vertex2[positionName];

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

  let normal = new R3([x, y, z]).direction();

  vertex0[normalName] = normal;
  vertex1[normalName] = normal;
  vertex2[normalName] = normal;
}

export = computeFaceNormals;
