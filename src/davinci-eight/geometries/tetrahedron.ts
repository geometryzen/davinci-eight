import expectArg = require('../checks/expectArg');
import Simplex = require('../geometries/Simplex');
import triangle = require('../geometries/triangle');
import VectorN = require('../math/VectorN');

/**
 * terahedron
 *
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 */
function tetrahedron(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes: { [name: string]: VectorN<number>[] } = {}, triangles: Simplex[] = []): Simplex[] {

  expectArg('a', a).toSatisfy(a instanceof VectorN, "a must be a VectorN");
  expectArg('b', b).toSatisfy(b instanceof VectorN, "b must be a VectorN");
  expectArg('c', c).toSatisfy(c instanceof VectorN, "c must be a VectorN");
  expectArg('d', d).toSatisfy(d instanceof VectorN, "d must be a VectorN");

  let triatts: { [name: string]: VectorN<number>[] } = {};
  let points = [a, b, c, d];
  let faces: Simplex[] = [];

  triangle(points[0], points[1], points[2], triatts, triangles);
  faces.push(triangles[triangles.length - 1]);

  triangle(points[1], points[3], points[2], triatts, triangles);
  faces.push(triangles[triangles.length - 1]);

  triangle(points[2], points[3], points[0], triatts, triangles);
  faces.push(triangles[triangles.length - 1]);

  triangle(points[3], points[1], points[0], triatts, triangles);
  faces.push(triangles[triangles.length - 1]);

  faces[3].vertices[0].opposing.push(faces[0]);
  faces[3].vertices[1].opposing.push(faces[1]);
  faces[3].vertices[2].opposing.push(faces[2]);

  faces[0].vertices[0].opposing.push(faces[1]);
  faces[0].vertices[1].opposing.push(faces[3]);
  faces[0].vertices[2].opposing.push(faces[2]);

  faces[1].vertices[0].opposing.push(faces[2]);
  faces[1].vertices[1].opposing.push(faces[3]);
  faces[1].vertices[2].opposing.push(faces[0]);

  faces[2].vertices[0].opposing.push(faces[3]);
  faces[2].vertices[1].opposing.push(faces[1]);
  faces[2].vertices[2].opposing.push(faces[0]);

  return triangles;
}

export = tetrahedron;