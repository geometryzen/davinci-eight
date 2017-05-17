import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
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
     * Constructs a GridXY
     */
    constructor(contextManager: ContextManager, options?: GridXYOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
