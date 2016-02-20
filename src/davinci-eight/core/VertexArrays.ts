import DrawMode from './DrawMode'
import VertexAttribPointer from './VertexAttribPointer'

interface VertexArrays {
    drawMode: DrawMode
    indices: number[]
    attributes: number[]
    stride: number
    pointers: VertexAttribPointer[]
}

export default VertexArrays
