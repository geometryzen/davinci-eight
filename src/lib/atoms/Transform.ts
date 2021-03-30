import { Vertex } from './Vertex';

/**
 * @hidden
 */
export interface Transform {
    exec(vertex: Vertex, u: number, v: number, uLength: number, vLength: number): void;
}
