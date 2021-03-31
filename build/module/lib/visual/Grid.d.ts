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
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: GridOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
}
