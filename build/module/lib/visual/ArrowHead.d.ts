import { ContextManager } from '../core/ContextManager';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { ArrowHeadGeometry } from '../geometries/ArrowHeadGeometry';
import { VectorE3 } from '../math/VectorE3';
import { ArrowOptions } from './ArrowOptions';
/**
 * @hidden
 */
export declare class ArrowHead extends Mesh<ArrowHeadGeometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: Partial<Pick<ArrowOptions, 'axis' | 'color' | 'heightCone' | 'mode' | 'offset' | 'radiusCone' | 'textured' | 'thetaSegments' | 'tilt'>>, levelUp?: number);
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    /**
     * The vector that is represented by the Arrow.
     *
     * magnitude(Arrow.vector) = Arrow.length
     * direction(Arrow.vector) = Arrow.axis
     * Arrow.vector = Arrow.length * Arrow.axis
     */
    get vector(): VectorE3;
    set vector(vector: VectorE3);
    get heightCone(): number;
    set heightCone(heightCone: number);
}
