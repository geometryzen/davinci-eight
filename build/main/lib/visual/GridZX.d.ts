import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
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
    constructor(contextManager: ContextManager, options?: GridZXOptions, levelUp?: number);
    protected destructor(levelUp: number): void;
}
