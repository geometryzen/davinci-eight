import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { CylinderGeometryOptions } from './CylinderGeometryOptions';
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
