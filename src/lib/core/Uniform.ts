import { ContextProgramConsumer } from './ContextProgramConsumer';
import { isNull } from '../checks/isNull';
import { mustBeObject } from '../checks/mustBeObject';

/**
 * A wrapper around a <code>WebGLUniformLocation</code>.
 */
export class Uniform implements ContextProgramConsumer {

    private gl: WebGLRenderingContext;

    private location: WebGLUniformLocation;

    private name: string;

    constructor(info: WebGLActiveInfo) {
        if (!isNull(info)) {
            mustBeObject('info', info);
            this.name = info.name;
        }
    }

    contextFree(): void {
        this.contextLost();
    }

    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void {
        this.contextLost();
        this.gl = gl;
        // If the location is null, no uniforms are updated and no error code is generated.
        if (!isNull(this.name)) {
            this.location = gl.getUniformLocation(program, this.name);
        }
        else {
            this.location = null;
        }
    }

    contextLost(): void {
        this.gl = void 0;
        this.location = void 0;
    }

    uniform1f(x: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform1f(this.location, x);
        }
    }

    uniform1i(x: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform1i(this.location, x);
        }
    }

    uniform2f(x: number, y: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform2f(this.location, x, y);
        }
    }

    uniform2i(x: number, y: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform2i(this.location, x, y);
        }
    }

    uniform3f(x: number, y: number, z: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform3f(this.location, x, y, z);
        }
    }

    uniform3i(x: number, y: number, z: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform3i(this.location, x, y, z);
        }
    }

    uniform4f(x: number, y: number, z: number, w: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform4f(this.location, x, y, z, w);
        }
    }

    uniform4i(x: number, y: number, z: number, w: number): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform4i(this.location, x, y, z, w);
        }
    }

    /**
     * Sets a uniform location of type <code>mat2</code> in the <code>WebGLProgram</code>.
     */
    matrix2fv(transpose: boolean, value: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniformMatrix2fv(this.location, transpose, value);
        }
    }

    /**
     * Sets a uniform location of type <code>mat3</code> in a <code>WebGLProgram</code>.
     */
    matrix3fv(transpose: boolean, value: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniformMatrix3fv(this.location, transpose, value);
        }
    }

    /**
     * Sets a uniform location of type <code>mat4</code> in a <code>WebGLProgram</code>.
     */
    matrix4fv(transpose: boolean, value: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniformMatrix4fv(this.location, transpose, value);
        }
    }

    uniform1fv(data: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform1fv(this.location, data);
        }
    }

    uniform2fv(data: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform2fv(this.location, data);
        }
    }

    uniform3fv(data: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform3fv(this.location, data);
        }
    }

    uniform4fv(data: Float32Array): void {
        const gl = this.gl;
        if (gl) {
            gl.uniform4fv(this.location, data);
        }
    }

    toString(): string {
        return ['uniform', this.name].join(' ');
    }
}
