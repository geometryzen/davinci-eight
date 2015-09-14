import VectorN = require('../math/VectorN');
/**
 * Holds all the values of a particular attribute.
 * The size property describes how to break up the values.
 * The length of the values should be an integer multiple of the size.
 */
declare class DrawAttribute {
    /**
     * The values of the attribute.
     */
    values: VectorN<number>;
    /**
     * The chunking size of the attribute.
     */
    size: number;
    constructor(values: VectorN<number>, size: number);
}
export = DrawAttribute;
