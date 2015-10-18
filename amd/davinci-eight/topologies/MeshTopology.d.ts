import DrawMode = require('../core/DrawMode');
import Topology = require('../topologies/Topology');
/**
 * @class MeshTopology
 * @extends Topology
 */
declare class MeshTopology extends Topology {
    /**
     * Abstract base class for topologies rendered using TRIANGLES, TRIANGLE_STRIP and TRIANGLE_FAN.
     * @class MeshTopology
     * @constructor
     * @param mode {DrawMode}
     * @param numVertices {number}
     */
    constructor(mode: DrawMode, numVertices: number);
}
export = MeshTopology;
