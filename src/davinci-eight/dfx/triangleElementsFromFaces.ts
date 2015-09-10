import Elements = require('../dfx/Elements');
import expectArg = require('../checks/expectArg');
import Face = require('../dfx/Face');
import FaceVertex = require('../dfx/FaceVertex');
import isDefined = require('../checks/isDefined');
import isUndefined = require('../checks/isUndefined');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
import stringFaceVertex = require('../dfx/stringFaceVertex');
import Symbolic = require('../core/Symbolic');

let VERTICES_PER_FACE = 3;
let COORDS_PER_POSITION = 3;
let COORDS_PER_NORMAL = 3;
let COORDS_PER_TEXTURE = 2;

// This function has the important side-effect of setting the index property.
// TODO: It would be better to copy the Face structure?
function computeUniques(faces: Face[]): FaceVertex[] {

  let map: { [key:string]: FaceVertex } = {};
  let uniques: FaceVertex[] = [];

  function munge(fv: FaceVertex) {
    let key = stringFaceVertex(fv);
    if (map[key]) {
      let existing: FaceVertex = map[key];
      fv.index = existing.index;
    }
    else {
      fv.index = uniques.length;
      uniques.push(fv);
      map[key] = fv;
    }
  }

  faces.forEach(function(face: Face) {
    munge(face.a);
    munge(face.b);
    munge(face.c);
  });

  return uniques;
}

function numberList(size: number, value: number): number[] {
  let data = [];
  for(var i = 0; i < size; i++) {data.push(value);}
  return data;
}

function attribName(name: string, attribMap?: {[name:string]:string}): string {
  if (isUndefined(attribMap)) {
    return name;
  }
  else {
    let alias = attribMap[name];
    return isDefined(alias) ? alias : name;
  }
}

function triangleElementsFromFaces(faces: Face[], attribMap?: {[name:string]:string}): Elements {
  expectArg('faces', faces).toBeObject();

  let uniques: FaceVertex[] = computeUniques(faces);

  var elements: { [key:string]: FaceVertex } = {};

  // Although it is possible to use a VectorN here, working with number[] will
  // be faster and will later allow us to fix the length of the VectorN.
  let indices: number[] = [];
  var positions: number[] = numberList(uniques.length * COORDS_PER_POSITION, void 0);
  var normals: number[] = numberList(uniques.length * COORDS_PER_NORMAL, void 0);
  var coords: number[] = numberList(uniques.length * COORDS_PER_TEXTURE, void 0);

  faces.forEach(function(face: Face, faceIndex: number) {
    let a: FaceVertex = face.a;
    let b: FaceVertex = face.b;
    let c: FaceVertex = face.c;

    let offset = faceIndex * 3

    indices.push(a.index);
    indices.push(b.index);
    indices.push(c.index);
  });

  uniques.forEach(function(unique: FaceVertex){
    let position = unique.position;
    let normal = unique.normal;
    let uvs = unique.coords;

    let index   = unique.index;

    let offset2x = index * COORDS_PER_TEXTURE;
    let offset2y = offset2x + 1;

    let offset3x = index * COORDS_PER_POSITION;
    let offset3y = offset3x + 1;
    let offset3z = offset3y + 1;

    positions[offset3x] = position.x; 
    positions[offset3y] = position.y; 
    positions[offset3z] = position.z; 

    normals[offset3x] = normal.x; 
    normals[offset3y] = normal.y; 
    normals[offset3z] = normal.z; 

    if (isDefined(uvs)) {
      coords[offset2x] = uvs.x; 
      coords[offset2y] = uvs.y; 
    }
    else {
      coords[offset2x] = 0; 
      coords[offset2y] = 0; 
    }
  });
  var attributes: { [name: string]: VectorN<number> } = {};
  // Specifying the size fixes the length of the VectorN, disabling push and pop, etc.
  attributes[attribName(Symbolic.ATTRIBUTE_POSITION, attribMap)] = new VectorN<number>(positions, false, positions.length);
  attributes[attribName(Symbolic.ATTRIBUTE_NORMAL, attribMap)]   = new VectorN<number>(normals, false, normals.length);
  attributes[attribName(Symbolic.ATTRIBUTE_TEXTURE, attribMap)]  = new VectorN<number>(coords, false, coords.length);
  return new Elements(new VectorN<number>(indices, false, indices.length), attributes);
}

export = triangleElementsFromFaces;