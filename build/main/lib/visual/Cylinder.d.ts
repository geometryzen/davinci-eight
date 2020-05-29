import { ContextManager } from '../core/ContextManager';
import { CylinderOptions } from './CylinderOptions';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
/**
 * A 3D visual representation of a cylinder.
 */
export declare class Cylinder extends Mesh<Geometry, Material> {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: CylinderOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * The length of the cylinder, a scalar. Defaults to 1.
     */
    get length(): number;
    set length(length: number);
    /**
     * The radius of the cylinder, a scalar. Defaults to 1.
     */
    get radius(): number;
    set radius(radius: number);
}
