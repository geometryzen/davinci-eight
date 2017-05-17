import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { SphereGeometryOptions } from './SphereGeometryOptions';
/**
 * A convenience class for creating a sphere.
 */
export declare class SphereGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: SphereGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
