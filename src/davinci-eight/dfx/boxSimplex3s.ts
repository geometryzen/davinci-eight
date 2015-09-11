import DfxGeometry = require('../dfx/DfxGeometry');
import Simplex3Geometry = require('../dfx/Simplex3Geometry');
import Simplex3 = require('../dfx/Simplex3');
import Simplex3Vertex = require('../dfx/Simplex3Vertex');
import Symbolic = require('../core/Symbolic');
import Vertex = require('../dfx/Vertex');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import makeSimplex3NormalCallback = require('../dfx/makeSimplex3NormalCallback');

function square(vecs: Vector3[], geometry: Simplex3Geometry, coords: Vector2[]): Simplex3[] {
  let faces = new Array<Simplex3>();
  let f012 = new Simplex3(vecs[0], vecs[1], vecs[2]);
  f012.a.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[0];
  f012.b.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[1];
  f012.c.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[2];
  geometry.addFace(f012);
  faces.push(f012);
  let f023 = new Simplex3(vecs[0], vecs[2], vecs[3]);
  f023.a.attributes[Symbolic.ATTRIBUTE_TEXTURE] = f012.a.attributes[Symbolic.ATTRIBUTE_TEXTURE];
  f023.b.attributes[Symbolic.ATTRIBUTE_TEXTURE] = f012.c.attributes[Symbolic.ATTRIBUTE_TEXTURE];
  f023.c.attributes[Symbolic.ATTRIBUTE_TEXTURE] = coords[3];
  geometry.addFace(f023);
  faces.push(f023);
  return faces;
}

function boxSimplex3s(): Simplex3[] {
    // box
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
    let geometry = new Simplex3Geometry();

    let vec0 = new Vector3([+1, +1, +1]);
    let vec1 = new Vector3([-1, +1, +1]);
    let vec2 = new Vector3([-1, -1, +1]);
    let vec3 = new Vector3([+1, -1, +1]);
    let vec4 = new Vector3([+1, -1, -1]);
    let vec5 = new Vector3([+1, +1, -1]);
    let vec6 = new Vector3([-1, +1, -1]);
    let vec7 = new Vector3([-1, -1, -1]);

    let c00 = new Vector2([0, 0]);
    let c01 = new Vector2([0, 1]);
    let c10 = new Vector2([1, 0]);
    let c11 = new Vector2([1, 1]);

    let coords: Vector2[] = [c11, c01, c00, c10];
    square([vec0,vec1,vec2,vec3], geometry, coords);  // front
    square([vec0,vec3,vec4,vec5], geometry, coords);  // right
    square([vec0,vec5,vec6,vec1], geometry, coords);  // top
    square([vec1,vec6,vec7,vec2], geometry, coords);  // left
    square([vec7,vec4,vec3,vec2], geometry, coords);  // bottom
    square([vec4,vec7,vec6,vec5], geometry, coords);  // back

    // GEOMETRY IS REALLY redundant now.
    return geometry.faces;
}

export = boxSimplex3s;