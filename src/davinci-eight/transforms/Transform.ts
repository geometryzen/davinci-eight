import Vertex from '../atoms/Vertex';

/**
 *
 */
interface Transform {
    exec(vertex: Vertex, u: number, v: number, uLength: number, vLength: number): void;
}

export default Transform;
