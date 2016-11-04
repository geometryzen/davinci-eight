import DataType from './DataType';

/**
 *
 */
interface VertexAttribPointer {

    /**
     *
     */
    name: string;

    /**
     *
     */
    size: number;

    /**
     * 
     */
    type: DataType;

    /**
     *
     */
    normalized: boolean;

    /**
     *
     */
    offset: number
}

export default VertexAttribPointer
