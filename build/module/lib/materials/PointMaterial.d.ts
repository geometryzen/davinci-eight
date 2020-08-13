import { ContextManager } from '../core/ContextManager';
import { PointMaterialOptions } from './PointMaterialOptions';
import { ShaderMaterial } from './ShaderMaterial';
/**
 *
 */
export declare class PointMaterial extends ShaderMaterial {
    /**
     *
     */
    constructor(contextManager: ContextManager, options: PointMaterialOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
