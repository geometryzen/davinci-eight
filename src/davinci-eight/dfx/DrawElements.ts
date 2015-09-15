import expectArg = require('../checks/expectArg');
import DrawAttribute = require('../dfx/DrawAttribute');
import VectorN = require('../math/VectorN');

class DrawElements {
  /**
   * 0 => POINTS, 1 => LINES, 2 => TRIANGLES
   */
   // TODO: Documentation and validation.
  public k: number;
  public indices: VectorN<number>;
  // TODO: Looks like a DrawAttributeMap here (implementation only)
  public attributes: {[name:string]: DrawAttribute} = {};
  constructor(k: number, indices: VectorN<number>, attributes: { [name: string]: DrawAttribute }) {
    expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
    expectArg('attributes', attributes).toBeObject();
    this.k = k;
    this.indices = indices;
    this.attributes = attributes;
  }
}

export = DrawElements;
