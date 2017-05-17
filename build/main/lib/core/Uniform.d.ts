import { ContextProgramConsumer } from './ContextProgramConsumer';
/**
 * A wrapper around a <code>WebGLUniformLocation</code>.
 */
export declare class Uniform implements ContextProgramConsumer {
    private gl;
    private location;
    private name;
    constructor(info: WebGLActiveInfo);
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
    uniform1f(x: number): void;
    uniform1i(x: number): void;
    uniform2f(x: number, y: number): void;
    uniform2i(x: number, y: number): void;
    uniform3f(x: number, y: number, z: number): void;
    uniform3i(x: number, y: number, z: number): void;
    uniform4f(x: number, y: number, z: number, w: number): void;
    uniform4i(x: number, y: number, z: number, w: number): void;
    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     */
    matrix2fv(transpose: boolean, value: Float32Array): void;
    /**
     * Sets a uniform location of type <code>mat3</code> in a <code>WebGLProgram</code>.
     */
    matrix3fv(transpose: boolean, value: Float32Array): void;
    /**
     * Sets a uniform location of type <code>mat4</code> in a <code>WebGLProgram</code>.
     */
    matrix4fv(transpose: boolean, value: Float32Array): void;
    uniform1fv(data: Float32Array): void;
    uniform2fv(data: Float32Array): void;
    uniform3fv(data: Float32Array): void;
    uniform4fv(data: Float32Array): void;
    toString(): string;
}
