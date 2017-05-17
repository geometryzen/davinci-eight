import { Vertex } from '../atoms/Vertex';
/**
 *
 */
export interface Transform {
    exec(vertex: Vertex, u: number, v: number, uLength: number, vLength: number): void;
}
