import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { CylinderOptions } from './CylinderOptions';
/**
 * A 3D visual representation of a cylinder.
 */
export declare class Cylinder extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: CylinderOptions, levelUp?: number);
    /**
     * @hidden
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
