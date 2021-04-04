import { ContextManager } from '../core/ContextManager';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { ArrowTailGeometry } from '../geometries/ArrowTailGeometry';
import { VectorE3 } from '../math/VectorE3';
import { ArrowOptions } from './ArrowOptions';
/**
 * @hidden
 */
export declare class ArrowTail extends Mesh<ArrowTailGeometry, Material> {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    constructor(contextManager: ContextManager, options?: Partial<ArrowOptions>, levelUp?: number);
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
    set vector(axis: VectorE3);
    /**
     * The length of the Arrow.
     * This property determines the scaling of the Arrow in all directions.
     */
    get length(): number;
    set length(length: number);
}
