import expectArg = require('../checks/expectArg');
import DrawAttribute = require('../dfx/DrawAttribute');
import VectorN = require('../math/VectorN');

class DrawElements {
  public indices: VectorN<number>;
  public attributes: {[name:string]: DrawAttribute} = {};
  constructor(indices: VectorN<number>, attributes: { [name: string]: DrawAttribute }) {
    expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
    expectArg('attributes', attributes).toBeObject();
    this.indices = indices;
    this.attributes = attributes;
  }
}

export = DrawElements;
