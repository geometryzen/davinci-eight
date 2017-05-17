import { BoxGeometryOptions } from './BoxGeometryOptions';
import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
/**
 * A convenience class for creating a BoxGeometry.
 */
export declare class BoxGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: BoxGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
