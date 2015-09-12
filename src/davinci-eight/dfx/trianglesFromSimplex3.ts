import Elements = require('../dfx/Elements');
import ElementsAttribute = require('../dfx/ElementsAttribute');
import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import uniqueVertices = require('../dfx/uniqueVertices');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
import Vertex = require('../dfx/Vertex');

function numberList(size: number, value: number): number[] {
  let data = [];
  for(var i = 0; i < size; i++) {data.push(value);}
  return data;
}

function attribName(name: string, attribMap?: { [name: string]: {name?:string}}): string {
  expectArg('name', name).toBeString();
  expectArg('attribMap', attribMap).toBeObject();
  let meta = attribMap[name];
  if (meta) {
    let alias = meta.name;
    return alias ? alias : name;
  }
  else {
    throw new Error("Unable to compute name; missing attribute specification for " + name);
  }
}

function attribSize(key: string, attribMap?: { [key: string]: {size:number}}): number {
  expectArg('key', key).toBeString();
  expectArg('attribMap', attribMap).toBeObject();
  let meta = attribMap[key];
  if (meta) {
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

function trianglesFromSimplex3(simplices: Simplex[], attribMap: { [name: string]: { name?: string; size: number}}): Elements {
  expectArg('simplices', simplices).toBeObject();
  expectArg('attribMap', attribMap).toBeObject();

  let uniques: Vertex[] = uniqueVertices(simplices);
  let elements: { [key:string]: Vertex } = {};
  // Initialize the output arrays for all the attributes specified.
  let outputs: { [key: string]: number[] } = {};
  Object.keys(attribMap).forEach(function(key: string) {
    outputs[key] = numberList(uniques.length * attribSize(key, attribMap), void 0);
  });
  // Cache the special cases (for now).
  let positions: number[] = outputs[Symbolic.ATTRIBUTE_POSITION];
  expectArg(Symbolic.ATTRIBUTE_POSITION, positions).toBeObject(missingSpecificationForPosition);

  // Each face produces three indices.
  let indices: number[] = simplices.map(Simplex.indices).reduce(concat, []);

  uniques.forEach(function(unique: Vertex){
    let position: VectorN<number> = unique.position;

    let index   = unique.index;

    // TODO: cache the size for position
    position.toArray(positions, index * attribSize(Symbolic.ATTRIBUTE_POSITION, attribMap));

    // TODO: Need string[] of custom keys... to avoid the test within the loop.
    Object.keys(attribMap).forEach(function(key: string) {
      let output = outputs[key];
      // TODO: We've already looked up the output, why not cache the size there?
      // FIXME: attribMap also contains a spec for positions and normal. Hmm.
      // The separation of custom and standard creates an issue.
      let data: VectorN<number> = unique.attributes[key];
      if (data) {
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

export = trianglesFromSimplex3;