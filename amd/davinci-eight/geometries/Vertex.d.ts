import VertexAttributeMap = require('../geometries/VertexAttributeMap');
declare class Vertex {
    attributes: VertexAttributeMap;
    /**
     * The index property is used when computing elements.
     * @deprecated
     */
    index: number;
    constructor();
    toString(): string;
}
export = Vertex;
