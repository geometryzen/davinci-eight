import DrawMode from '../core/DrawMode';
import Topology from './Topology';

export default class PointTopology extends Topology {
    constructor(numVertices: number) {
        super(DrawMode.POINTS, numVertices)
    }
}
