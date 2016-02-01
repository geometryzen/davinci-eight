/**
 * An array of attribute values associated with meta data describing how to interpret the values.
 * @class Attribute
 */
interface Attribute {
    /**
     * The values of the attribute.
     * @property values
     * @type {number[]}
     */
    values: number[];

    /**
     * The number of values that are associated with a given vertex.
     * @property size
     * @type {number}
     */
    size: number;

    /**
     * Intentionally undocumented.
     * This functionality may be introduced in future.
     */
    normalized?: boolean;

    /**
     * Intentionally undocumented.
     * This functionality may be introduced in future.
     */
    stride?: number;

    /**
     * Intentionally undocumented.
     * This functionality may be introduced in future.
     */
    offset?: number;
}

export default Attribute;
