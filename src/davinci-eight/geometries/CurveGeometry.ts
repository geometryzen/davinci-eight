import GeometryElements from '../core/GeometryElements'
import CurveGeometryOptions from './CurveGeometryOptions'
import curveVertexArrays from './curveVertexArrays'

/**
 * 
 */
export default class CurveGeometry extends GeometryElements {

    /**
     * @param options
     * @param levelUp
     */
    constructor(options: CurveGeometryOptions = {}, levelUp = 0) {
        super(curveVertexArrays(options), options.tilt, options.engine, levelUp + 1);
        this.setLoggingName('CurveGeometry');
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }
}
