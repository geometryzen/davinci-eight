import { ContextManager } from '../core/ContextManager';
import { CylinderGeometryOptions } from './CylinderGeometryOptions';
import { GeometryElements } from '../core/GeometryElements';
/**
 * A geometry for a Cylinder.
 */
export declare class CylinderGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: CylinderGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
