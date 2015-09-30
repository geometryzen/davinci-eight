import Simplex = require('../geometries/Simplex');
import VertexAttributeMap = require('../geometries/VertexAttributeMap');
declare class Vertex {
    parent: Simplex;
    opposing: Simplex[];
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
