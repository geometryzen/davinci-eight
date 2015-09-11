import Elements = require('../dfx/Elements');
import expectArg = require('../checks/expectArg');
import Simplex3 = require('../dfx/Simplex3');
import Simplex3Vertex = require('../dfx/Simplex3Vertex');
import isDefined = require('../checks/isDefined');
import isUndefined = require('../checks/isUndefined');
import ElementsAttribute = require('../dfx/ElementsAttribute');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
import stringifySimplex3Vertex = require('../dfx/stringifySimplex3Vertex');
import Symbolic = require('../core/Symbolic');

let VERTICES_PER_FACE = 3;

// This function has the important side-effect of setting the index property.
// TODO: It would be better to copy the Simplex3 structure?
function computeUniques(faces: Simplex3[]): Simplex3Vertex[] {

  let map: { [key:string]: Simplex3Vertex } = {};
  let uniques: Simplex3Vertex[] = [];

  function munge(fv: Simplex3Vertex) {
    let key = stringifySimplex3Vertex(fv);
    if (map[key]) {
      let existing: Simplex3Vertex = map[key];
      fv.index = existing.index;
    }
    else {
      fv.index = uniques.length;
      uniques.push(fv);
      map[key] = fv;
    }
  }

  faces.forEach(function(face: Simplex3) {
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

function attribName(name: string, attribMap?: { [name: string]: {name?:string}}): string {
  expectArg('name', name).toBeString();
  expectArg('attribMap', attribMap).toBeObject();
  let meta = attribMap[name];
  if (isDefined(meta)) {
    let alias = meta.name;
    return isDefined(alias) ? alias : name;
  }
  else {
    throw new Error("Unable to compute name; missing attribute specification for " + name);
  }
}

function attribSize(key: string, attribMap?: { [key: string]: {size:number}}): number {
  expectArg('key', key).toBeString();
  expectArg('attribMap', attribMap).toBeObject();
  let meta = attribMap[key];
  if (isDefined(meta)) {
    let size = meta.size;
    // TODO: Override the message...
    expectArg('size', size).toBeNumber();
    return meta.size;
  }
  else {
    throw new Error("Unable to compute size; missing attribute specification for " + key);
  }
}

function concat(a: number[], b: number[]): number[] {
  return a.concat(b);
}

function missingSpecificationForPosition() {
  return "missing specification for " + Symbolic.ATTRIBUTE_POSITION;
}

function missingSpecificationForNormal() {
  return "missing specification for " + Symbolic.ATTRIBUTE_NORMAL;
}

function triangleElementsFromSimplex3s(faces: Simplex3[], attribMap: { [name: string]: { name?: string; size: number}}): Elements {
  expectArg('faces', faces).toBeObject();
  expectArg('attribMap', attribMap).toBeObject();

  let uniques: Simplex3Vertex[] = computeUniques(faces);
  let elements: { [key:string]: Simplex3Vertex } = {};
  // Initialize the output arrays for all the attributes specified.
  let outputs: { [key: string]: number[] } = {};
  Object.keys(attribMap).forEach(function(key: string) {
    outputs[key] = numberList(uniques.length * attribSize(key, attribMap), void 0);
  });
  // Cache the special cases (for now).
  let positions: number[] = outputs[Symbolic.ATTRIBUTE_POSITION];
  expectArg(Symbolic.ATTRIBUTE_POSITION, positions).toBeObject(missingSpecificationForPosition);
  let normals: number[] = outputs[Symbolic.ATTRIBUTE_NORMAL];
  expectArg(Symbolic.ATTRIBUTE_NORMAL, normals).toBeObject(missingSpecificationForNormal);

  // Each face produces three indices.
  let indices: number[] = faces.map(Simplex3.indices).reduce(concat, []);

  uniques.forEach(function(unique: Simplex3Vertex){
    let position: VectorN<number> = unique.position;
    let normal: VectorN<number> = unique.normal;

    let index   = unique.index;

    // TODO: cache the size for position
    position.toArray(positions, index * attribSize(Symbolic.ATTRIBUTE_POSITION, attribMap));
    // TODO: cache the size for position.
    normal.toArray(normals, index * attribSize(Symbolic.ATTRIBUTE_NORMAL, attribMap));

    // TODO: Need string[] of custom keys... to avoid the test within the loop.
    Object.keys(attribMap).forEach(function(key: string) {
      let output = outputs[key];
      // TODO: We've already looked up the output, why not cache the size there?
      // FIXME: attribMap also contains a spec for positions and normal. Hmm.
      // The separation of custom and standard creates an issue.
      let data: VectorN<number> = unique.attributes[key];
      if (isDefined(data)) {
        unique.attributes[key].toArray(output, index * attribSize(key, attribMap));
      }
    });
  });
  var attributes: { [name: string]: ElementsAttribute } = {};
  // Specifying the size fixes the length of the VectorN, disabling push and pop, etc.
  // TODO: Use map
  Object.keys(attribMap).forEach(function(key: string) {
    let output: number[] = outputs[key];
    let data = outputs[key];
    // TODO: We've already looked up output. Why not cache the output name and use the size?
    let vector = new VectorN<number>(data, false, data.length);
    attributes[attribName(key, attribMap)] = new ElementsAttribute(vector, attribSize(key, attribMap));
  });
  return new Elements(new VectorN<number>(indices, false, indices.length), attributes);
}

export = triangleElementsFromSimplex3s;