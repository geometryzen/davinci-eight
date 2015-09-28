import VectorN = require('../math/VectorN');
/**
 * <p>
 * Holds all the values of a particular attribute.
 * The size property describes how to break up the values.
 * The length of the values should be an integer multiple of the size.
 * </p>

  var x = 3;

 * @class SerialGeometryAttribute
 */
declare class SerialGeometryAttribute {
    /**
     *
     * The values of the attribute.
     */
    values: VectorN<number>;
    /**
     * The chunking size of the attribute.
     * This is distinct from the size in the `GeometryMeta`.
     * The chunking size is invariant given the values and is used to describe the vertex attribute pointer.
     */
    size: number;
    /**
     * @class SerialGeometryAttribute
     * @constructor
     * @param values {VectorN<number>}
     * @param size {number}
     */
    constructor(values: VectorN<number>, size: number);
}
export = SerialGeometryAttribute;
