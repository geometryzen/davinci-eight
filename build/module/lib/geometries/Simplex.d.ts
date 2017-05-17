import { SimplexMode } from './SimplexMode';
import { Vertex } from '../atoms/Vertex';
import { VectorN } from '../atoms/VectorN';
export declare class Simplex {
    vertices: Vertex[];
    constructor(k: SimplexMode);
    readonly k: SimplexMode;
    static indices(simplex: Simplex): number[];
    private static boundaryMap(simplex);
    private static subdivideMap(simplex);
    static boundary(simplices: Simplex[], count?: number): Simplex[];
    static subdivide(simplices: Simplex[], count?: number): Simplex[];
    /**
     * Copies the attributes onto all vertices of the simplex.
     */
    static setAttributeValues(attributes: {
        [name: string]: VectorN<number>[];
    }, simplex: Simplex): void;
}
