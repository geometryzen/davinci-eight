import { ContextManager } from '../core/ContextManager';
import { GeometryMode } from '../geometries/GeometryMode';
import { Grid } from './Grid';
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
     * Constructs a GridYZ.
     */
    constructor(contextManager: ContextManager, options?: GridYZOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
