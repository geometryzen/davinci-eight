import { BeginMode } from './BeginMode';
import { VertexAttribPointer } from './VertexAttribPointer';

/**
 * Geometry data that has been interleaved for efficiency.
 */
export interface VertexArrays {

    /**
     *
     */
    mode: BeginMode;

    /**
     *
     */
    indices?: number[];

    /**
     * The interleaved attribute data.
     */
    attributes: number[];

    /**
     *
     */
    stride: number;

    /**
     * A description of the interleaved attribute data.
     */
    pointers: VertexAttribPointer[];
}
