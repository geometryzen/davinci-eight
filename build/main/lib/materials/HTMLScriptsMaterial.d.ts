import { ContextManager } from '../core/ContextManager';
import { ShaderMaterial } from './ShaderMaterial';
/**
 * A shareable WebGL program based upon shader source code in HTML script elements.
 *
 * This class provides a convenient way of creating custom GLSL programs.
 * The scripts are lazily loaded so that the constructor may be called before
 * the DOM has finished loading.
 */
export declare class HTMLScriptsMaterial extends ShaderMaterial {
    /**
     * @param contextManager
     * @param scriptIds The element identifiers for the vertex and fragment shader respectively.
     * @param attribs An array of strings containing the order of attributes.
     * @param dom The document object model that owns the script elements.
     * @param levelUp
     */
    constructor(contextManager: ContextManager, scriptIds: string[], attribs?: string[], dom?: Document, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
