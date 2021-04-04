import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
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
export declare class ArrowHeadGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: ArrowHeadGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
