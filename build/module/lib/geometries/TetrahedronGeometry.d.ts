import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { TetrahedronGeometryOptions } from './TetrahedronGeometryOptions';
/**
 * A convenience class for creating a tetrahedron geometry.
 * @hidden
 */
export declare class TetrahedronGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: TetrahedronGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
