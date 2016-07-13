import GeometryElements from '../core/GeometryElements';
import TetrahedronGeometryOptions from './TetrahedronGeometryOptions';
import tetrahedronVertexArrays from './tetrahedronVertexArrays';

/**
 * A convenience class for creating a tetrahedron geometry.
 */
export default class TetrahedronGeometry extends GeometryElements {

    /**
     *
     * @param options
     * @param levelUp
     */
    constructor(options: TetrahedronGeometryOptions = {}, levelUp = 0) {
        super(tetrahedronVertexArrays(options), options.tilt, options.engine, levelUp + 1);
        this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
