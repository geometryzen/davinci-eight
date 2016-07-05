import BeginMode from './BeginMode'
import VertexAttribPointer from './VertexAttribPointer'

/**
 * @class VertexArrays
 */
interface VertexArrays {

    /**
     *
     */
    drawMode: BeginMode

    /**
     * @attribute indices
     * @type number[]
     */
    indices: number[]

    /**
     * @ttribute attributes
     * @type number[]
     */
    attributes: number[]

    /**
     * @attribute stride
     * @type number
     */
    stride: number

    /**
     * @attribute pointers
     * @type VertexAttribPointer[]
     */
    pointers: VertexAttribPointer[]
}

export default VertexArrays
