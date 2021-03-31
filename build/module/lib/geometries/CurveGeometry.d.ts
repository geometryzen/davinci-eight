import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { CurveGeometryOptions } from './CurveGeometryOptions';
/**
 * A Geometry for representing functions of one scalar parameter.
 * @hidden
 */
export declare class CurveGeometry extends GeometryElements {
    constructor(contextManager: ContextManager, options?: CurveGeometryOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
