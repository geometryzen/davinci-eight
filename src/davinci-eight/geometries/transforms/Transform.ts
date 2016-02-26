import Vertex from '../Vertex'

interface Transform {
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void
}

export default Transform
