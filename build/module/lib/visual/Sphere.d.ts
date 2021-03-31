import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { SphereOptions } from './SphereOptions';
/**
 *
 */
export declare class Sphere extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: SphereOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    get radius(): number;
    set radius(radius: number);
}
