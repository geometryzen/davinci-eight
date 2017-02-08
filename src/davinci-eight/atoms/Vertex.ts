import { Coords } from '../math/Coords';
import mustBeGE from '../checks/mustBeGE';
import mustBeInteger from '../checks/mustBeInteger';
import VectorN from './VectorN';
import VertexAttributeMap from './VertexAttributeMap';

function stringVectorN(name: string, vector: VectorN<number>): string {
    if (vector) {
        return name + vector.toString();
    }
    else {
        return name;
    }
}

function stringifyVertex(vertex: Vertex): string {
    const attributes: VertexAttributeMap = vertex.attributes;
    const attribsKey = Object.keys(attributes).map(function (name: string) {
        const vector: VectorN<number> = attributes[name];
        return stringVectorN(name, vector);
    }).join(' ');
    return attribsKey;
}

/**
 * The data for a vertex in a normalized and uncompressed format that is easy to manipulate.
 */
export default class Vertex {

    /**
     * The attribute data for this vertex.
     */
    public attributes: VertexAttributeMap = {};

    /**
     * The abstract coordinates that label the vertex.
     */
    public coords: Coords;

    /**
     * The index of the vertex.
     */
    public index: number;

    /**
     * @param numCoordinates The number of coordinates (dimensionality).
     */
    constructor(numCoordinates: number) {
        mustBeInteger('numCoordinates', numCoordinates);
        mustBeGE('numCoordinates', numCoordinates, 0);
        const data: number[] = [];
        for (let i = 0; i < numCoordinates; i++) {
            data.push(0);
        }
        this.coords = new Coords(data, false, numCoordinates);
    }

    /**
     * @returns A string representation of this vertex.
     */
    toString(): string {
        return stringifyVertex(this);
    }
}
