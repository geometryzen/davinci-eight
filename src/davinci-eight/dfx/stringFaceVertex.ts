import isDefined = require('../checks/isDefined');
import FaceVertex = require('../dfx/FaceVertex');
import VectorN = require('../math/VectorN');

function stringVectorN(name: string, vector: VectorN<number>): string {
  if (isDefined(vector)) {
    return name + vector.toString();
  }
  else {
    return name;
  }
}

function stringFaceVertex(faceVertex: FaceVertex): string {
  let attributes: {[name:string]: VectorN<number>} = faceVertex.attributes;
  let attribsKey = Object.keys(attributes).map(function(name:string) {
      let vector: VectorN<number> = attributes[name];
      return stringVectorN(name, vector);
  }).join(' ');
  return stringVectorN('P', faceVertex.position) + stringVectorN('N', faceVertex.normal) + attribsKey;
}

export = stringFaceVertex;
