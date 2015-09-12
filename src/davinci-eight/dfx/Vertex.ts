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
//  return stringVectorN('P', vertex.position) + attribsKey;
  return attribsKey;
}

class Vertex {
  public parent: Simplex;
//  public position: VectorN<number>;
  public attributes: { [name: string]: VectorN<number> } = {};
  /**
   * The index property is used when computing elements.
   */
  public index: number;
  constructor(position: VectorN<number>) {
    expectArg('position', position).toBeObject();
    this.attributes[Symbolic.ATTRIBUTE_POSITION] = position;
//  this.position = position;
  }
  toString(): string {
    return stringifyVertex(this);
  }
}

export = Vertex;