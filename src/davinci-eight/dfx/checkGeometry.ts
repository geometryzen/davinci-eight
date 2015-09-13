import expectArg = require('../checks/expectArg');

import Simplex = require('../dfx/Simplex');
import Vertex = require('../dfx/Vertex');
import VectorN = require('../math/VectorN');

function checkGeometry(geometry: Simplex[]): { [key: string]: { size: number } } {
  let knowns: { [key: string]: { size: number } } = {};
  let geometryLen = geometry.length;
  for (var i = 0; i < geometryLen; i++) {
    let simplex: Simplex = geometry[i];
    expectArg('simplex', simplex).toSatisfy(simplex instanceof Simplex, "Every element must be a Simplex");
    let vertices: Vertex[] = simplex.vertices;
    for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
      let vertex: Vertex = vertices[j];
      let attributes = vertex.attributes;
      let keys: string[] = Object.keys(attributes);
      let keysLen = keys.length;
      for (var k = 0; k < keysLen; k++) {
        let key = keys[k];
        let vector: VectorN<number> = attributes[key];
        let known = knowns[key];
        if (known) {
          if (known.size !== vector.length) {
            throw new Error("Something is rotten in Denmark!");
          }
        }
        else {
          knowns[key] = { size: vector.length };
        }
      }
    }
  }
  return knowns;
}

export = checkGeometry;
