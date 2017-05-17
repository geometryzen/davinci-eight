import { ArrowGeometryOptions } from './ArrowGeometryOptions';
import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
/**
 * <p>
 * A convenience class for creating an arrow.
 * </p>
 * <p>
 * The initial axis unit vector defaults to <b>e<b><sub>2</sub>
 * </p>
 * <p>
 * The cutLine unit vector defaults to <b>e<b><sub>3</sub>
 * </p>
 */
export declare class ArrowGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: ArrowGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
