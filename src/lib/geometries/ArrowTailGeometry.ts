import { ContextManager } from "../core/ContextManager";
import { GeometryElements } from "../core/GeometryElements";
import { arrowTailPrimitive } from "./arrowPrimitive";
import { GeometryOptions } from "./GeometryOptions";

/**
 * @hidden
 */
export interface ArrowTailGeometryOptions extends GeometryOptions {
    /**
     * Defaults to 0.80
     */
    heightShaft?: number;
    /**
     * Defaults to 0.01
     */
    radiusShaft?: number;
    /**
     * Defaults to 16
     * Minimum is 3
     */
    thetaSegments?: number;
}

/**
 * @hidden
 */
export class ArrowTailGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options: ArrowTailGeometryOptions = {}, levelUp = 0) {
        super(contextManager, arrowTailPrimitive(options), options, levelUp + 1);
        this.setLoggingName("ArrowTailGeometry");
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     *
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName("ArrowTailGeometry");
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
