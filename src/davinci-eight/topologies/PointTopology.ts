import DrawMode = require('../core/DrawMode')
import Topology = require('../topologies/Topology')

/**
 * @class PointTopology
 */
class PointTopology extends Topology {
    /**
     * Abstract base class for geometric primitives POINTS.
     * @class PointTopology
     * @constructor
     * @param numVertices {number}
     */
    constructor(numVertices: number) {
        super(DrawMode.POINTS, numVertices)
    }
}

export = PointTopology