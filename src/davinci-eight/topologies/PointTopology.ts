import DrawMode from '../core/DrawMode';
import Topology from '../topologies/Topology';

export default class PointTopology extends Topology {
    constructor(numVertices: number) {
        super(DrawMode.POINTS, numVertices)
    }
}
