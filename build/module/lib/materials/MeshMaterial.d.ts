import { ContextManager } from '../core/ContextManager';
import { MeshMaterialOptions } from './MeshMaterialOptions';
import { ShaderMaterial } from './ShaderMaterial';
/**
 * @hidden
 */
export declare class MeshMaterial extends ShaderMaterial {
    /**
     * 1. Creates a subscription to WebGL rendering context events but does not subscribe.
     * 2. Constructs vertex and fragment shader sources.
     * 3. Sets the name for reporting reference counts.
     * 4. Synchronize with the WebGL rendering context if this is a top-level class (levelUp is zero).
     *
     * The contextManager must be defined.
     *
     * @param contextManager The ContextManager that will be subscribed to for WebGL rendering context events.
     * @param options Used to configure the MeshMaterial.
     * @param levelUp Defines the level of the MeshMaterial in the inheritance hierarchy.
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
