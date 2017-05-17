import { ContextManager } from '../core/ContextManager';
import { ShaderMaterial } from './ShaderMaterial';
import { PointMaterialOptions } from './PointMaterialOptions';
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
