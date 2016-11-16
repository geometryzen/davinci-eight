import ContextManager from '../core/ContextManager';
import GeometryElements from '../core/GeometryElements';
import CurveGeometryOptions from './CurveGeometryOptions';
import curvePrimitive from './curvePrimitive';

export default class CurveGeometry extends GeometryElements {

    constructor(contextManager: ContextManager, options: CurveGeometryOptions = {}, levelUp = 0) {
        super(contextManager, curvePrimitive(options), options, levelUp + 1);
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
