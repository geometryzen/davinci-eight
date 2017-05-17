import { DataType } from './DataType';

/**
 *
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
