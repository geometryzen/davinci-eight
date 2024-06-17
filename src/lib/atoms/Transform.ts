import { Vertex } from "./Vertex";

/**
 * @hidden
 */
export interface Transform {
    /**
     *
     * @param vertex
     * @param u
     * @param v
     * @param uLength
     * @param vLength
     */
    exec(vertex: Vertex, u: number, v: number, uLength: number, vLength: number): void;
}
