import GeometryElements from '../core/GeometryElements';
import GridGeometryOptions from './GridGeometryOptions';
import gridVertexArrays from './gridVertexArrays';

export default class GridGeometry extends GeometryElements {

    constructor(options: GridGeometryOptions = {}, levelUp = 0) {
        super(gridVertexArrays(options), options.tilt, options.engine, levelUp + 1);
        this.setLoggingName('GridGeometry');
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}
