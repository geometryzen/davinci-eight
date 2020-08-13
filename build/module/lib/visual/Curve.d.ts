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
     * Constructs a Curve.
     */
    constructor(contextManager: ContextManager, options?: CurveOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
