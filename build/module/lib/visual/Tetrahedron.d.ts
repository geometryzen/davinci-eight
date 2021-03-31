import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { TetrahedronOptions } from './TetrahedronOptions';
/**
 * A 3D visual representation of a tetrahedron.
 */
export declare class Tetrahedron extends Mesh<Geometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: TetrahedronOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    get radius(): number;
    set radius(radius: number);
}
