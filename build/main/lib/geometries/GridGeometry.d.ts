import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { GridGeometryOptions } from './GridGeometryOptions';
/**
 * A Geometry for representing functions of two scalar parameters.
 */
export declare class GridGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: GridGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
