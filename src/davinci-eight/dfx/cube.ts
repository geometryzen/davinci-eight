import Simplex = require('../dfx/Simplex');
import quad = require('../dfx/quad');
import Symbolic = require('../core/Symbolic');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

// cube
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3
//
function cube(): Simplex[] {
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
  
  let front  = quad([vec0,vec1,vec2,vec3], coords);
  let right  = quad([vec0,vec3,vec4,vec5], coords);
  let top    = quad([vec0,vec5,vec6,vec1], coords);
  let left   = quad([vec1,vec6,vec7,vec2], coords);
  let bottom = quad([vec7,vec4,vec3,vec2], coords);
  let back   = quad([vec4,vec7,vec6,vec5], coords);

  let squares = [front, right, top, left, bottom, back];

  return squares.reduce(function(a: Simplex[], b: Simplex[]) { return a.concat(b) }, []);
}

export = cube;