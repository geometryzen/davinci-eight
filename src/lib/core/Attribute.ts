import { AttributeSizeType } from './AttributeSizeType';

/**
 * An array of attribute values associated with meta data describing how to interpret the values.
 */
export interface Attribute {

    /**
     * The values of the attribute.
     */
    values: number[];

    /**
     * The number of values that are associated with a given vertex.
     */
    size: AttributeSizeType;
}
