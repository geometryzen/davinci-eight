import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { GeometryOptions } from './GeometryOptions';
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
export declare class ArrowTailGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: ArrowTailGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
