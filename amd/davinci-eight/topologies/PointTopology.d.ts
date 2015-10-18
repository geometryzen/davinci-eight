import Topology = require('../topologies/Topology');
/**
 * @class PointTopology
 */
declare class PointTopology extends Topology {
    /**
     * Abstract base class for geometric primitives POINTS.
     * @class PointTopology
     * @constructor
     * @param numVertices {number}
     */
    constructor(numVertices: number);
}
export = PointTopology;
