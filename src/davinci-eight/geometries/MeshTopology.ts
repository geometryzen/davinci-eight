import DrawMode from '../core/DrawMode';
import Topology from './Topology';

export default class MeshTopology extends Topology {
    constructor(mode: DrawMode, numVertices: number) {
        super(mode, numVertices)
    }
}
