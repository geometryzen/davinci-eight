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
     * @param scriptIds The element identifiers for the vertex and fragment shader respectively.
     * @param dom The document object model that owns the script elements.
     * @param attribs An array of strings containing the order of attributes.
     * @param contextManager
     * @param levelUp
     */
    constructor(scriptIds: string[], dom: Document, attribs: string[], contextManager: ContextManager, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
