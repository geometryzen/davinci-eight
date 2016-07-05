import DataType from './DataType';

/**
 * An array of attribute values associated with meta data describing how to interpret the values.
 */
interface Attribute {

    /**
     * The values of the attribute.
     */
    values: number[];

    /**
     * The number of values that are associated with a given vertex.
     */
    size: number;

    /**
     * The type of the attribute. This must be converted to the WebGL native type.
     */
    dataType: DataType;
}

export default Attribute;
