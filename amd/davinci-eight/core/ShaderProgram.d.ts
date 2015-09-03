import AttribDataInfos = require('../core/AttribDataInfos');
import RenderingContextUser = require('../core/RenderingContextUser');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ShaderUniformSetter = require('../core/ShaderUniformSetter');
import UniformDataInfos = require('../core/UniformDataInfos');
/**
 * The role of a ShaderProgram is to manage the WebGLProgram consisting of a vertex shader and fragment shader.
 * The ShaderProgram must be able to provide introspection information that describes the program.
 * @class ShaderProgram
 * @extends RenderingContextUser
 */
interface ShaderProgram extends RenderingContextUser {
    /**
     * @property program
     * @type WebGLProgram
     */
    program: WebGLProgram;
    /**
     * @property programId
     * @type string
     */
    programId: string;
    /**
     * @property vertexShader
     * @type string
     */
    vertexShader: string;
    /**
     * @property fragmentShader
     * @type string
     */
    fragmentShader: string;
    /**
     * Makes the ShaderProgram the current program for WebGL.
     * @method use
     */
    use(): ShaderProgram;
    /**
     * Sets the attributes provided into the appropriate locations.
     */
    setAttributes(values: AttribDataInfos): any;
    /**
     * Sets the uniforms provided into the appropriate locations.
     * @param values {UniformDataInfos}
     */
    setUniforms(values: UniformDataInfos): any;
    uniform1f(name: string, x: number, picky?: boolean): any;
    uniform1fv(name: string, value: number[], picky?: boolean): any;
    uniform2f(name: string, x: number, y: number, picky?: boolean): any;
    uniform2fv(name: string, value: number[], picky?: boolean): any;
    uniform3f(name: string, x: number, y: number, z: number, picky?: boolean): any;
    uniform3fv(name: string, value: number[], picky?: boolean): any;
    uniform4f(name: string, x: number, y: number, z: number, w: number, picky?: boolean): any;
    uniform4fv(name: string, value: number[], picky?: boolean): any;
    uniformMatrix2fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean): any;
    uniformMatrix3fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean): any;
    uniformMatrix4fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean): any;
    /**
     *
     */
    attributeLocations: {
        [name: string]: ShaderAttribLocation;
    };
    /**
     *
     */
    uniformLocations: {
        [name: string]: ShaderUniformLocation;
    };
    /**
     *
     */
    uniformSetters: {
        [name: string]: ShaderUniformSetter;
    };
}
export = ShaderProgram;
