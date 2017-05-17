import { ArrowGeometryOptions } from './ArrowGeometryOptions';
import { arrowPrimitive } from './arrowPrimitive';
import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';

/**
 * <p>
 * A convenience class for creating an arrow.
 * </p>
 * <p>
 * The initial axis unit vector defaults to <b>e<b><sub>2</sub>
 * </p>
 * <p>
 * The cutLine unit vector defaults to <b>e<b><sub>3</sub>
 * </p>
 */
export class ArrowGeometry extends GeometryElements {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: ArrowGeometryOptions = { kind: 'ArrowGeometry' }, levelUp = 0) {
        super(contextManager, arrowPrimitive(options), options, levelUp + 1);
        this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('ArrowGeometry');
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
