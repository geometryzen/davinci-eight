import Attribute = require('../geometries/Attribute');
/**
 * @class DrawAttribute
 */
declare class DrawAttribute implements Attribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    values: number[];
    /**
     * The chunking size of the attribute.
     * The chunking size is invariant given the values and is used to describe the vertex attribute pointer.
     * @property size
     * @type {number}
     */
    size: number;
    /**
     * A convenience class for constructing and validating attribute values used for drawing.
     * @class DrawAttribute
     * @constructor
     * @param values {number[]}
     * @param size {number}
     */
    constructor(values: number[], size: number);
}
export = DrawAttribute;
