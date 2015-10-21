import MeshTopology = require('../topologies/MeshTopology');
import Vertex = require('../geometries/Vertex');
/**
 * @class GridTopology
 * @extends MeshTopology
 */
declare class GridTopology extends MeshTopology {
    private _uSegments;
    private _vSegments;
    constructor(uSegments: number, vSegments: number);
    uSegments: number;
    uLength: number;
    vSegments: number;
    vLength: number;
    /**
     * <p>
     * Provides access to each vertex so that attributes may be set.
     * The indices
     * </p>
     * @method vertex
     * @param uIndex {number} The zero-based `horizontal` index.
     * @param vIndex {number} The zero-based 'vertical` index.
     * @return {Vertex} The vertex corresponding to the specified coordinates.
     * @example
         var topo = new EIGHT.GridTopology(1, 1)
         topo.vertex(uIndex, vIndex).attributes('aPosition') = new MutableVectorE3([i - 0.5, j - 0.5, 0])
     */
    vertex(uIndex: number, vIndex: number): Vertex;
}
export = GridTopology;
