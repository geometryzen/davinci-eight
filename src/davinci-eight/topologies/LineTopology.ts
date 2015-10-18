import DrawMode = require('../core/DrawMode')
import Topology = require('../topologies/Topology')

/**
 * @class LineTopology
 */
class LineTopology extends Topology {
    /**
     * Abstract base class for geometric primitives LINES, LINE_STRIP and LINE_LOOP.
     * @class LineTopology
     * @constructor
     * @param mode {DrawMode}
     * @param numVertices {number}
     */
    constructor(mode: DrawMode, numVertices: number) {
        super(mode, numVertices)
    }
}

export = LineTopology