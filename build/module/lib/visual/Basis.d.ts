import { BasisOptions } from './BasisOptions';
import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../math/Vector3';
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
     *
     */
    constructor(contextManager: ContextManager, options?: BasisOptions, levelUp?: number);
    protected destructor(levelUp: number): void;
    readonly a: Vector3;
    readonly b: Vector3;
    readonly c: Vector3;
    readonly colorA: Color;
    readonly colorB: Color;
    readonly colorC: Color;
}
