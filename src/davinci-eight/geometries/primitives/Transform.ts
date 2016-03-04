import Vertex from './Vertex'

/**
 * @class Transform
 */
interface Transform {
    exec(vertex: Vertex, u: number, v: number, uLength: number, vLength: number): void
}

export default Transform
