import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { GridOptions } from './GridOptions';
/**
 * A 3D visual representation of a a discrete parameterized surface.
 */
export declare class Grid extends Mesh<Geometry, Material> {
    /**
     * Constructs a Grid.
     */
    constructor(engine: ContextManager, options?: GridOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
