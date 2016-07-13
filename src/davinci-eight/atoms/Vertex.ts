import {Coords} from '../math/Coords'
import mustBeGE from '../checks/mustBeGE'
import mustBeInteger from '../checks/mustBeInteger'
import {VectorN} from '../math/VectorN'
import VertexAttributeMap from './VertexAttributeMap'

function stringVectorN(name: string, vector: VectorN<number>): string {
    if (vector) {
        return name + vector.toString();
    }
    else {
        return name;
    }
}

function stringifyVertex(vertex: Vertex): string {
    let attributes: VertexAttributeMap = vertex.attributes;
    let attribsKey = Object.keys(attributes).map(function(name: string) {
        let vector: VectorN<number> = attributes[name];
        return stringVectorN(name, vector);
    }).join(' ');
    return attribsKey;
}

/**
 *
 */
export default class Vertex {

    /**
     *
     */
    public attributes: VertexAttributeMap = {}

    /**
     * The abstract cordinates that label the vertex.
     */
    public coords: Coords;

    /**
     *
     */
    public index: number;

    /**
     *
     */
    constructor(numCoordinates: number) {
        mustBeInteger('numCoordinates', numCoordinates)
        mustBeGE('numCoordinates', numCoordinates, 0)
        const data: number[] = []
        for (let i = 0; i < numCoordinates; i++) {
            data.push(0)
        }
        this.coords = new Coords(data, false, numCoordinates)
    }

    /**
     * 
     */
    toString(): string {
        return stringifyVertex(this)
    }
}
