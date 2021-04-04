import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { arrowHeadPrimitive } from './arrowPrimitive';
import { GeometryOptions } from './GeometryOptions';

/**
 * @hidden
 */
export interface ArrowHeadGeometryOptions extends GeometryOptions {
    /**
     * Defaults to 0.20
     */
    heightCone?: number;
    /**
     * Defaults to 0.08
     */
    radiusCone?: number;
    /**
     * Defaults to 16
     * Minimum is 3
     */
    thetaSegments?: number;
}

/**
 * @hidden
 */
export class ArrowHeadGeometry extends GeometryElements {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: ArrowHeadGeometryOptions = {}, levelUp = 0) {
        super(contextManager, arrowHeadPrimitive(options), options, levelUp + 1);
        this.setLoggingName('ArrowHeadGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('ArrowHeadGeometry');
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
