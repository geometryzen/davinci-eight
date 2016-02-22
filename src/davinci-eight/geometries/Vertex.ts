import VectorN from '../math/VectorN';
import VertexAttributeMap from '../geometries/VertexAttributeMap';

/**
 * @module EIGHT
 * @submodule geometries
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
     * @property index
     * @type number
     * @deprecated (Maybe)
     */
    public index: number;
    /**
     * @class Vertex
     * @constructor
     */
    constructor() {
      // Do nothing.
    }
    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        return stringifyVertex(this)
    }
}
