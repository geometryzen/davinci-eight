import { BoxOptions } from './BoxOptions';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
/**
 * A 3D visual representation of a box.
 */
export declare class Box extends Mesh<Geometry, Material> {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: BoxOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * @default 1
     */
    width: number;
    /**
     *
     */
    height: number;
    /**
     *
     */
    depth: number;
}
