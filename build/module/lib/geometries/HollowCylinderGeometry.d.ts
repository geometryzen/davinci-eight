import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { HollowCylinderGeometryOptions } from './HollowCylinderGeometryOptions';
/**
 *
 */
export declare class HollowCylinderGeometry extends GeometryElements {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: HollowCylinderGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
