import AttribDataInfos = require('../core/AttribDataInfos');
import Resource = require('../core/Resource');
import AttribLocation = require('../core/AttribLocation');
import UniformLocation = require('../core/UniformLocation');
import UniformDataVisitor = require('../core/UniformDataVisitor');
/**
 * The role of a Program is to manage the WebGLProgram consisting of a vertex shader and fragment shader.
 * The Program must be able to provide introspection information that describes the program.
 * @class Program
 * @extends Resource
 */
interface Program extends Resource, UniformDataVisitor {
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
     * Makes the Program the current program for WebGL.
     * @method use
     */
    use(): Program;
    /**
     * Sets the attributes provided into the appropriate locations.
     */
    setAttributes(values: AttribDataInfos): any;
    /**
     * @property attributeLocations
     * @type { [name: string]: AttribLocation }
     */
    attributes: {
        [name: string]: AttribLocation;
    };
    /**
     * @property uniforms
     * @type { [name: string]: UniformLocation }
     */
    uniforms: {
        [name: string]: UniformLocation;
    };
    /**
     *
     */
    enableAttrib(name: string): any;
}
export = Program;
