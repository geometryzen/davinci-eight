import expectArg = require('../checks/expectArg');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import VectorN = require('../math/VectorN');

function stringVectorN(name: string, vector: VectorN<number>): string {
  if (vector) {
    return name + vector.toString();
  }
  else {
    return name;
  }
}

function stringifyVertex(vertex: Vertex): string {
  let attributes: {[name:string]: VectorN<number>} = vertex.attributes;
  let attribsKey = Object.keys(attributes).map(function(name:string) {
      let vector: VectorN<number> = attributes[name];
      return stringVectorN(name, vector);
  }).join(' ');
  return attribsKey;
}

class Vertex {
  public parent: Simplex;
  public opposing: Simplex[] = [];
  public attributes: { [name: string]: VectorN<number> } = {};
  /**
   * The index property is used when computing elements.
   */
  public index: number;
  constructor() {
  }
  toString(): string {
    return stringifyVertex(this);
  }
}

export = Vertex;