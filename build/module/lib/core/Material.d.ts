import { Attrib } from './Attrib';
import { BeginMode } from './BeginMode';
import { DataType } from './DataType';
import { FacetVisitor } from './FacetVisitor';
import { ContextConsumer } from './ContextConsumer';
import { Uniform } from './Uniform';
import { VertexBuffer } from './VertexBuffer';
/**
 * Material is an object-oriented wrapper around a WebGLProgram
 */
export interface Material extends FacetVisitor, ContextConsumer {
    /**
     *
     */
    attrib(name: string, value: VertexBuffer, size: number, normalized?: boolean, stride?: number, offset?: number): Material;
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
    /**
     *
     */
    drawArrays(mode: BeginMode, first: number, count: number): Material;
    /**
     *
     */
    drawElements(mode: BeginMode, count: number, type: DataType, offset: number): Material;
    getUniform(name: string): Uniform;
    hasUniform(name: string): boolean;
    matrix2fv(name: string, elements: Float32Array, transpose?: boolean): Material;
    matrix3fv(name: string, elements: Float32Array, transpose?: boolean): Material;
    matrix4fv(name: string, elements: Float32Array, transpose?: boolean): Material;
    /**
     *
     */
    uniform(name: string, value: number | number[]): Material;
    use(): Material;
}
