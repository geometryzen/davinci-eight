import { ArrowOptions } from './ArrowOptions';
import { ContextManager } from '../core/ContextManager';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Mesh } from '../core/Mesh';
import { VectorE3 } from '../math/VectorE3';
/**
 * A Mesh in the form of an arrow that may be used to represent a vector quantity.
 */
export declare class Arrow extends Mesh<Geometry, Material> {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: ArrowOptions, levelUp?: number);
    /**
     *
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
