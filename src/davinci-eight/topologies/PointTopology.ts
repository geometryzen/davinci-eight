import DrawMode from '../core/DrawMode';
import Topology from '../topologies/Topology';

/**
 * @class PointTopology
 */
export default class PointTopology extends Topology {
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
