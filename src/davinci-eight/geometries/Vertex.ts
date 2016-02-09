import VectorN from '../math/VectorN';
import VertexAttributeMap from '../geometries/VertexAttributeMap';

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

export default class Vertex {
    public attributes: VertexAttributeMap = {};
    public index: number;
    constructor() {
      // Do nothing.
    }
    toString(): string {
        return stringifyVertex(this);
    }
}
