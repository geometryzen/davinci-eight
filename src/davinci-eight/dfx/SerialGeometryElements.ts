import expectArg = require('../checks/expectArg');
import SerialGeometryAttribute = require('../dfx/SerialGeometryAttribute');
import VectorN = require('../math/VectorN');

/**
 * @class SerialGeometryElements
 */
class SerialGeometryElements {
  /**
   * 0 => POINTS, 1 => LINES, 2 => TRIANGLES
   */
   // TODO: Documentation and validation.
  public k: number;
  /**
   * @property indices
   * @type {VectorN}
   */
  public indices: VectorN<number>;
  // TODO: Looks like a DrawAttributeMap here (implementation only)
  /**
   * @property attributes
   * @type {{[name:string]: SerialGeometryAttribute}}
   */
  public attributes: {[name:string]: SerialGeometryAttribute} = {};
  /**
   * @class SerialGeometryElements
   * @constructor
   * @param k {number} <p>The dimensionality of the primitives.</p>
   * @param indices {VectorN} <p>A list of index into the attributes</p>
   * @param attributes {{[name:string]: SerialGeometryAttribute}}
   */
  constructor(k: number, indices: VectorN<number>, attributes: { [name: string]: SerialGeometryAttribute }) {
    expectArg('indices', indices).toBeObject().toSatisfy(indices instanceof VectorN, "indices must be a VectorN<number>");
    expectArg('attributes', attributes).toBeObject();
    this.k = k;
    this.indices = indices;
    this.attributes = attributes;
  }
}

export = SerialGeometryElements;
