/**
 * @class DrawAttribute
 */
declare class DrawAttribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    values: number[];
    /**
     * The chunking chunkSize of the attribute.
     * The chunking chunkSize is invariant given the values and is used to describe the vertex attribute pointer.
     * @property chunkSize
     * @type {number}
     */
    chunkSize: number;
    /**
     * @class DrawAttribute
     * @constructor
     * @param values {number[]}
     * @param chunkSize {number}
     */
    constructor(values: number[], chunkSize: number);
}
export = DrawAttribute;
