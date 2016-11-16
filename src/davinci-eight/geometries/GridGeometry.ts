import ContextManager from '../core/ContextManager';
import GeometryElements from '../core/GeometryElements';
import GridGeometryOptions from './GridGeometryOptions';
import gridPrimitive from './gridPrimitive';

export default class GridGeometry extends GeometryElements {

    constructor(contextManager: ContextManager, options: GridGeometryOptions = {}, levelUp = 0) {
        super(contextManager, gridPrimitive(options), options, levelUp + 1);
        this.setLoggingName('GridGeometry');
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
