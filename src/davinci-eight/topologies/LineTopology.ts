import DrawMode from '../core/DrawMode';
import Topology from '../topologies/Topology';

export default class LineTopology extends Topology {
    constructor(mode: DrawMode, numVertices: number) {
        super(mode, numVertices)
    }
}
