import {FacetVisitor} from './FacetVisitor';
import {ContextConsumer} from './ContextConsumer';
import UniformLocation from './UniformLocation';

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
     * @param name The name of the attribute.
     * @returns The index of the attribute.
     */
    getAttribLocation(name: string): number;

    /**
     * @param indexOrName The index or name of the attribute.
     */
    enableAttrib(indexOrName: number | string): void;

    /**
     * 
     */
    vertexPointer(indexOrName: number | string, size: number, normalized: boolean, stride: number, offset: number): void;

    /**
     * @param name
     * @returns
     */
    getUniformLocation(name: string): UniformLocation;

    /**
     *
     */
    use(): void
}
