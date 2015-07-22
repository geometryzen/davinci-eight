import RenderingContextUser = require('../core/RenderingContextUser');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
/**
 * The role of a ShaderProgram is to manage the WebGLProgram consisting of a vertex shader and fragment shader.
 * The ShaderProgram must be able to provide introspection information that describes the program.
 * @class ShaderProgram
 * @extends RenderingContextUser
 */
interface ShaderProgram extends RenderingContextUser {
    /**
     * @property attributes
     * @type ShaderVariableDecl
     */
    attributes: ShaderVariableDecl[];
    /**
     * @property uniforms
     * @type ShaderVariableDecl
     */
    uniforms: ShaderVariableDecl[];
    /**
     * @property varyings
     * @type ShaderVariableDecl
     */
    varyings: ShaderVariableDecl[];
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
     * This method has no effect if the ShaderProgram does not have a WebGLRenderingContext.
     * @method use
     */
    use(): void;
}
export = ShaderProgram;
