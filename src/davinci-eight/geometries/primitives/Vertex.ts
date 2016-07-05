import {Coords} from '../../math/Coords'
import mustBeGE from '../../checks/mustBeGE'
import mustBeInteger from '../../checks/mustBeInteger'
import {VectorN} from '../../math/VectorN'
import VertexAttributeMap from './VertexAttributeMap'

/**
 * @module EIGHT
 * @submodule primitives
 */

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
 * @class Vertex
 */
export default class Vertex {

    /**
     * @property attributes
     * @type VertexAttributeMap
     */
    public attributes: VertexAttributeMap = {}

    /**
     * The abstract cordinates that label the vertex.
     *
     * @property coords
     * @type Coords
     */
    public coords: Coords;

    /**
     * @property index
     * @type number
     */
    public index: number;

    /**
     * @class Vertex
     * @constructor
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
     * @method toString
     * @return {string}
     */
    toString(): string {
        return stringifyVertex(this)
    }
}
