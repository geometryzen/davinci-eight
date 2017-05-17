import { ContextManager } from '../core/ContextManager';
import { ShaderMaterial } from './ShaderMaterial';
import { MeshMaterialOptions } from './MeshMaterialOptions';
/**
 *
 */
export declare class MeshMaterial extends ShaderMaterial {
    /**
     *
     */
    constructor(contextManager: ContextManager, options: MeshMaterialOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
