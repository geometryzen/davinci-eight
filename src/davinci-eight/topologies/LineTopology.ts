import DrawMode from '../core/DrawMode';
import Topology from '../topologies/Topology';

/**
 * @class LineTopology
 */
export default class LineTopology extends Topology {
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
