import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
/**
 * @hidden
 */
export interface GridZXOptions {
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    xMin?: number;
    xMax?: number;
    xSegments?: number;
    y?: (z: number, x: number) => number;
    mode?: GeometryMode;
}
/**
 * A #d visual representation of a grid in the zx plane.
 */
export declare class GridZX extends Grid {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: GridZXOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
}
