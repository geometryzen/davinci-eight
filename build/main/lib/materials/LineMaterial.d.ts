import { ContextManager } from '../core/ContextManager';
import { LineMaterialOptions } from './LineMaterialOptions';
import { ShaderMaterial } from './ShaderMaterial';
/**
 * Generates a WebGLProgram suitable for use with LINES, and LINE_STRIP.
 *
 * <table>
 * <tr>
 * <td>attribute</td><td>vec3</td><td>aPosition</td>
 * </tr>
 * </table>
 */
export declare class LineMaterial extends ShaderMaterial {
    /**
     *
     */
    constructor(contextManager: ContextManager, options?: LineMaterialOptions, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
