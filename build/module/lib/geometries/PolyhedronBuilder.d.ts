import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
/**
 * In elementary geometry, a polyhedron is a solid in three dimensions with
 * flat polygonal faces, straight edges and sharp corners or vertices.
 * @hidden
 */
export declare class PolyhedronBuilder extends SimplexPrimitivesBuilder {
    /**
     *
     * param vertices {number} An array of 3 * N numbers representing N vertices.
     * param indices {number} An array of 3 * M numbers representing M triangles.
     *
     * param radius The distance of the polyhedron points from the origin.
     * param detail The number of times to subdivide the triangles in the faces.
     */
    constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
    protected regenerate(): void;
}
