import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { VectorE3 } from '../math/VectorE3';
import { ArrowOptions } from './ArrowOptions';
/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
export declare class Arrow extends Mesh<Geometry, Material> {
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
    set vector(vector: VectorE3);
    /**
     * The length of the Arrow.
     * This property determines the scaling of the Arrow in all directions.
     */
    get length(): number;
    set length(length: number);
}
