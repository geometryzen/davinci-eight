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
     * Constructs a HollowCylinder.
     */
    constructor(contextManager: ContextManager, options?: HollowCylinderOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * The length of the cylinder, a scalar. Defaults to 1.
     */
    get length(): number;
    set length(length: number);
}
