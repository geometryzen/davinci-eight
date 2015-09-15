import Simplex = require('../dfx/Simplex');
import VectorN = require('../math/VectorN');
import VertexAttributeMap = require('../dfx/VertexAttributeMap');

function stringVectorN(name: string, vector: VectorN<number>): string {
  if (vector) {
    return name + vector.toString();
  }
  else {
    return name;
  }
}

function stringifyVertex(vertex: Vertex): string {
  let attributes: VertexAttributeMap = vertex.attributes;
  let attribsKey = Object.keys(attributes).map(function(name:string) {
      let vector: VectorN<number> = attributes[name];
      return stringVectorN(name, vector);
  }).join(' ');
  return attribsKey;
}

class Vertex {
  public parent: Simplex;
  public opposing: Simplex[] = [];
  public attributes: VertexAttributeMap = {};
  /**
   * The index property is used when computing elements.
   * @deprecated
   */
  public index: number;
  constructor() {
  }
  toString(): string {
    return stringifyVertex(this);
  }
}

export = Vertex;