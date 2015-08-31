import RenderingContextUser = require('../core/RenderingContextUser');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderAttribSetter = require('../core/ShaderAttribSetter');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ShaderUniformSetter = require('../core/UniformSetter');
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
     * Sets the uniforms provided into the appropriate locations.
     */
    setUniforms(values: UniformDataInfos): any;
    /**
     *
     */
    attributeLocations: {
        [name: string]: ShaderAttribLocation;
    };
    /**
     *
     */
    attribSetters: {
        [name: string]: ShaderAttribSetter;
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
