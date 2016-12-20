import ContextManager from '../core/ContextManager';
import GeometryElements from '../core/GeometryElements';
import TetrahedronGeometryOptions from './TetrahedronGeometryOptions';
import tetrahedronPrimitive from './tetrahedronPrimitive';

/**
 * A convenience class for creating a tetrahedron geometry.
 */
export default class TetrahedronGeometry extends GeometryElements {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: TetrahedronGeometryOptions = { kind: 'TetrahedronGeometry' }, levelUp = 0) {
        super(contextManager, tetrahedronPrimitive(options), options, levelUp + 1);
        this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('TetrahedronGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
