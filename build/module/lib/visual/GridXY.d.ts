import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
/**
 * @hidden
 */
export interface GridXYOptions {
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    z?: (x: number, y: number) => number;
    mode?: GeometryMode;
}
/**
 * A grid in the xy plane.
 */
export declare class GridXY extends Grid {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: GridXYOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
}
