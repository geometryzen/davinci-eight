import expectArg = require('../checks/expectArg');
import ElementsAttribute = require('../dfx/ElementsAttribute');
import VectorN = require('../math/VectorN');

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