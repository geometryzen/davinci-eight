import expectArg = require('../checks/expectArg');
import VectorN = require('../math/VectorN');

class Elements {
  public indices: VectorN<number>;
  public attributes: {[name:string]:VectorN<number>} = {};
  constructor(indices: VectorN<number>, attributes: { [name: string]: VectorN<number> }) {
    expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
    expectArg('attributes', attributes).toBeObject();
    this.indices = indices;
    this.attributes = attributes;
  }
}

export = Elements;