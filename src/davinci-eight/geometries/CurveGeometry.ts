import GeometryElements from '../core/GeometryElements';
import CurveGeometryOptions from './CurveGeometryOptions';
import curvePrimitive from './curvePrimitive';

/**
 * 
 */
export default class CurveGeometry extends GeometryElements {

    /**
     * @param options
     * @param levelUp
     */
    constructor(options: CurveGeometryOptions = {}, levelUp = 0) {
        super(curvePrimitive(options), options.engine, options, levelUp + 1);
        this.setLoggingName('CurveGeometry');
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
