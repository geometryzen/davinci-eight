import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../math/Vector3';
import { BasisOptions } from './BasisOptions';
/**
 * A 3D visual representation of a reference frame or basis vectors.
 */
export declare class Basis extends Mesh<Geometry, Material> {
    private uPointA;
    private uPointB;
    private uPointC;
    private uColorA;
    private uColorB;
    private uColorC;
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: BasisOptions, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    get a(): Vector3;
    get b(): Vector3;
    get c(): Vector3;
    get colorA(): Color;
    get colorB(): Color;
    get colorC(): Color;
}
