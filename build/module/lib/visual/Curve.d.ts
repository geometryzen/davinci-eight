import { ContextManager } from '../core/ContextManager';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { CurveGeometry } from '../geometries/CurveGeometry';
import { CurveOptions } from './CurveOptions';
/**
 * A 3D visual representation of a discrete parameterized line.
 */
export declare class Curve extends Mesh<CurveGeometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: CurveOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
}
