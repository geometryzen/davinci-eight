import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { HollowCylinderOptions } from './HollowCylinderOptions';
/**
 * A 3D visual representation of a hollow cylinder.
 */
export declare class HollowCylinder extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: HollowCylinderOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    /**
     * The length of the cylinder, a scalar. Defaults to 1.
     */
    get length(): number;
    set length(length: number);
}
