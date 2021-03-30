import { VectorN } from '../atoms/VectorN';
import { Vertex } from '../atoms/Vertex';
import { SimplexMode } from './SimplexMode';
/**
 * @hidden
 */
export declare class Simplex {
    vertices: Vertex[];
    constructor(k: SimplexMode);
    get k(): SimplexMode;
    static indices(simplex: Simplex): number[];
    private static boundaryMap;
    private static subdivideMap;
    static boundary(simplices: Simplex[], count?: number): Simplex[];
    static subdivide(simplices: Simplex[], count?: number): Simplex[];
    /**
     * Copies the attributes onto all vertices of the simplex.
     */
    static setAttributeValues(attributes: {
        [name: string]: VectorN<number>[];
    }, simplex: Simplex): void;
}
