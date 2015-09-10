import expectArg = require('../checks/expectArg');
import ElementsAttribute = require('../dfx/ElementsAttribute');
import VectorN = require('../math/VectorN');

// The use of VectorN rather than number[] points to a possible reactive implementation.
// If the manager holds on to the Elements then with notifications we get dynamic updating?
// How can we get 2-way binding?
class Elements {
  public indices: VectorN<number>;
  public attributes: {[name:string]: ElementsAttribute} = {};
  constructor(indices: VectorN<number>, attributes: { [name: string]: ElementsAttribute }) {
    expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
    expectArg('attributes', attributes).toBeObject();
    this.indices = indices;
    this.attributes = attributes;
  }
}

export = Elements;