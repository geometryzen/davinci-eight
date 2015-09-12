import Elements = require('../dfx/Elements');
import ElementsAttribute = require('../dfx/ElementsAttribute');
import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import uniqueVertices = require('../dfx/uniqueVertices');
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

function triangles(faces: Simplex[], attribMap: { [name: string]: { name?: string; size: number}}): Elements {
  expectArg('faces', faces).toBeObject();
  expectArg('attribMap', attribMap).toBeObject();

  let uniques: Vertex[] = uniqueVertices(faces);
  let elements: { [key:string]: Vertex } = {};
  // Initialize the output arrays for all the attributes specified.
  let outputs: { [key: string]: number[] } = {};
  Object.keys(attribMap).forEach(function(key: string) {
    outputs[key] = numberList(uniques.length * attribSize(key, attribMap), void 0);
  });

  // Each simplex produces three indices.
  let indices: number[] = faces.map(Simplex.indices).reduce(concat, []);

  uniques.forEach(function(unique: Vertex){
    let index   = unique.index;

    // TODO: Need string[] of custom keys... to avoid the test within the loop.
    Object.keys(attribMap).forEach(function(key: string) {
      let output = outputs[key];
      // TODO: We've already looked up the output, why not cache the size there?
      // FIXME: attribMap also contains a spec for positions and normal. Hmm.
      // The separation of custom and standard creates an issue.
      let data = unique.attributes[key];
      if (data) {
        data.toArray(output, index * attribSize(key, attribMap));
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

export = triangles;