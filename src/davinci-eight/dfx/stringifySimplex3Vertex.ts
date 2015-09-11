import isDefined = require('../checks/isDefined');
import Simplex3Vertex = require('../dfx/Simplex3Vertex');
import VectorN = require('../math/VectorN');

function stringVectorN(name: string, vector: VectorN<number>): string {
  if (isDefined(vector)) {
    return name + vector.toString();
  }
  else {
    return name;
  }
}

function stringifySimplex3Vertex(vertex: Simplex3Vertex): string {
  let attributes: {[name:string]: VectorN<number>} = vertex.attributes;
  let attribsKey = Object.keys(attributes).map(function(name:string) {
      let vector: VectorN<number> = attributes[name];
      return stringVectorN(name, vector);
  }).join(' ');
  return stringVectorN('P', vertex.position) + stringVectorN('N', vertex.normal) + attribsKey;
}

export = stringifySimplex3Vertex;
