import { DataType } from './DataType';

/**
 * @hidden
 */
export interface VertexAttribPointer {

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
    offset: number;
}
