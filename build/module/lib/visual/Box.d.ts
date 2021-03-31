import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { BoxOptions } from './BoxOptions';
/**
 * A 3D visual representation of a box.
 */
export declare class Box extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: BoxOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    /**
     * @default 1
     */
    get width(): number;
    set width(width: number);
    /**
     *
     */
    get height(): number;
    set height(height: number);
    /**
     *
     */
    get depth(): number;
    set depth(depth: number);
}
