/**
 * <p>
 * Holds all the values of a particular attribute.
 * The size property describes how to break up the values.
 * The length of the values should be an integer multiple of the size.
 * </p>

  var x = 3;

 * @class GeometryAttribute
 */
declare class GeometryAttribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    values: number[];
    /**
     * The chunking size of the attribute.
     * This is distinct from the size in the `GeometryMeta`.
     * The chunking size is invariant given the values and is used to describe the vertex attribute pointer.
     * @property size
     * @type {number}
     */
    size: number;
    /**
     * @class GeometryAttribute
     * @constructor
     * @param values {number[]}
     * @param size {number}
     */
    constructor(values: number[], size: number);
}
export = GeometryAttribute;
