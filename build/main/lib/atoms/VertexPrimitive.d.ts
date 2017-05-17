import { BeginMode } from '../core/BeginMode';
import { Primitive } from '../core/Primitive';
import { Transform } from './Transform';
import { Vertex } from './Vertex';
/**
 * The VertexPrimitive class provides the preferred method for creating geometries.
 * Classes derived from VertexPrimitive create vertices and pathways through them
 * with indices such as TRIANGLE_STRIP. (Reversing this procedure from an arbitrary
 * collection of simplices is an NP problem). The resulting topology can then be
 * modified by a parameterized function either prior to buffering or in a shader.
 * VertexPrimitive uses the Vertex structure which is based on VectorN for ease of mesh
 * generation and transformation. Topolgy provides a toPrimitive method which results
 * in a more compact representation based upon number[]. An even more compact
 * representation is VertexArrays, which interleaves the vertex.
 */
export declare class VertexPrimitive {
    /**
     *
     */
    private mode;
    /**
     *
     */
    protected elements: number[];
    /**
     *
     */
    protected vertices: Vertex[];
    /**
     * Constructs a VertexPrimitive and initializes the vertices property with the required number of vertices.
     *
     * @param mode
     * @param numVertices
     * @param numCoordinates The number of coordinates required to label each vertex.
     */
    constructor(mode: BeginMode, numVertices: number, numCoordinates: number);
    vertexTransform(transform: Transform): void;
    /**
     *
     */
    toPrimitive(): Primitive;
}
