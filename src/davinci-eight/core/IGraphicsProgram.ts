import IResource from '../core/IResource';
import AttribLocation from '../core/AttribLocation';
import UniformLocation from '../core/UniformLocation';
import FacetVisitor from '../core/FacetVisitor';

// FIXME: Handle lists of shaders.

/**
 * <p>
 * The role of a IGraphicsProgram is to manage WebGLProgram(s) consisting of a vertex shader and fragment shader.
 * The Program must be able to provide introspection information that describes the program.
 * </p>
 * @class IGraphicsProgram
 * @extends IResource
 * @extends FacetVisitor
 * @beta
 */
interface IGraphicsProgram extends IResource, FacetVisitor {

    /**
     * @property uuid
     * @type string
     */
    uuid: string;

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
     * @return {void}
     */
    use(): void;

    /**
     * @method attributes
     * @return {{ [name: string]: AttribLocation }}
     */
    attributes(): { [name: string]: AttribLocation };

    /**
     * @method uniforms
     * @return {{ [name: string]: UniformLocation }}
     */
    uniforms(): { [name: string]: UniformLocation };

    /**
     * <p>
     * Enables an attribute location of a WebGLProgram.
     * </p>
     * @method enableAttrib
     * @param name {string} The name of the attribute to enable.
     * @return {void}
     * @beta
     */
    // FIXME: Can we move to the attribute index?
    enableAttrib(name: string): void;

    /**
     * <p>
     * Disables an attribute location of a WebGLProgram.
     * </p>
     * @method disableAttrib
     * @param name {string} The name of the attribute disable.
     * @return {void}
     * @beta
     */
    // FIXME: Can we move to the attribute index?
    disableAttrib(name: string): void;
}

export default IGraphicsProgram;
