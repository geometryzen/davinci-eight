import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { BoxGeometryOptions } from './BoxGeometryOptions';
/**
 * A convenience class for creating a BoxGeometry.
 * @hidden
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
