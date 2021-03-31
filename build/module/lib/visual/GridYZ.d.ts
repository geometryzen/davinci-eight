import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
/**
 * @hidden
 */
export interface GridYZOptions {
    yMin?: number;
    yMax?: number;
    ySegments?: number;
    zMin?: number;
    zMax?: number;
    zSegments?: number;
    x?: (y: number, z: number) => number;
    mode?: GeometryMode;
}
/**
 * A grid in the yz plane.
 */
export declare class GridYZ extends Grid {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: GridYZOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
}
