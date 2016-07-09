import BeginMode from './BeginMode'
import VertexAttribPointer from './VertexAttribPointer'

/**
 *
 */
interface VertexArrays {

    /**
     *
     */
    drawMode: BeginMode

    /**
     *
     */
    indices?: number[]

    /**
     *
     */
    attributes: number[]

    /**
     *
     */
    stride: number

    /**
     *
     */
    pointers: VertexAttribPointer[]
}

export default VertexArrays
