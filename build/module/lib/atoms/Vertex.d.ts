import { Coords } from '../math/Coords';
import { VertexAttributeMap } from './VertexAttributeMap';
/**
 * The data for a vertex in a normalized and uncompressed format that is easy to manipulate.
 * @hidden
 */
export declare class Vertex {
    /**
     * The attribute data for this vertex.
     */
    attributes: VertexAttributeMap;
    /**
     * The abstract coordinates that label the vertex.
     */
    coords: Coords;
    /**
     * The index of the vertex.
     */
    index: number;
    /**
     * @param numCoordinates The number of coordinates (dimensionality).
     */
    constructor(numCoordinates: number);
    /**
     * @returns A string representation of this vertex.
     */
    toString(): string;
}
