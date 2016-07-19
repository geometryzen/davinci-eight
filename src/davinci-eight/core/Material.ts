import {FacetVisitor} from './FacetVisitor';
import {ContextConsumer} from './ContextConsumer';
import Attrib from './Attrib';
import Uniform from './Uniform';

/**
 * <p>
 * <code>Material</code> is an object-oriented wrapper around a <code>WebGLProgram</code>
 * <p/>
 */
export interface Material extends FacetVisitor, ContextConsumer {

    /**
     *
     */
    vertexShaderSrc: string

    /**
     *
     */
    fragmentShaderSrc: string

    /**
     *
     */
    getAttrib(indexOrName: number | string): Attrib;

    /**
     * @param name The name of the attribute.
     * @returns The index of the attribute.
     */
    getAttribLocation(name: string): number;

    /**
     * @param indexOrName The index or name of the attribute.
     */
    enableAttrib(indexOrName: number | string): void;

    /**
     * @param indexOrName The index or name of the attribute.
     */
    disableAttrib(indexOrName: number | string): void;

    getUniform(name: string): Uniform;

    hasUniform(name: string): boolean;

    use(): void
}
