import DfxGeometry = require('../dfx/DfxGeometry');
import Face3Geometry = require('../dfx/Face3Geometry');
import Face = require('../dfx/Face');
import FaceVertex = require('../dfx/FaceVertex');
import Vertex = require('../dfx/Vertex');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import makeFaceNormalCallback = require('../dfx/makeFaceNormalCallback');

function square(vecs: Vector3[], geometry: Face3Geometry, coords: Vector2[]): Face[] {
  let faces = new Array<Face>();
  let f012 = new Face(vecs[0], vecs[1], vecs[2]);
  f012.a.coords = coords[0];
  f012.b.coords = coords[1];
  f012.c.coords = coords[2];
  geometry.addFace(f012);
  faces.push(f012);
  let f023 = new Face(vecs[0], vecs[2], vecs[3]);
  f023.a.coords = f012.a.coords;
  f023.b.coords = f012.c.coords;
  f023.c.coords = coords[3];
  geometry.addFace(f023);
  faces.push(f023);
  return faces;
}

function makeBoxGeometry(): Face[] {
    // box
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
    let geometry = new Face3Geometry();

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

export = makeBoxGeometry;