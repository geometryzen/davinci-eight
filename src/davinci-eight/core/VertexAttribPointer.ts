import DataType from './DataType';
/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class VertexAttribPointer
 */
interface VertexAttribPointer {

    /**
     * @attribute name
     * @type string
     */
    name: string;

    /**
     * @attribute size
     * @type number
     */
    size: number;

    /**
     * 
     */
    type: DataType;

    /**
     * @attribute normalized
     * @type boolean
     */
    normalized: boolean;

    /**
     * @attribute offset
     * @type number
     */
    offset: number
}

export default VertexAttribPointer
