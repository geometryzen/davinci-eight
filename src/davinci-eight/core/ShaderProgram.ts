import RenderingContextUser = require('../core/RenderingContextUser');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
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
   * @property constants
   * @type ShaderVariableDecl
   */
  constants: ShaderVariableDecl[];
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
  /**
   * Provides a reference to the attribute variable location object (ShaderAttribLocation).
   * This reference is managed by the ShaderProgram, ensuring that the location
   * is updated through context loss and restore events.
   * @method attributeVariable
   * @param name {string} The name of the attribute variable.
   */
  attributeLocation(name: string): ShaderAttribLocation;
  /**
   * Provides a reference to the uniform variable location object (ShaderUniformLocation).
   * This reference is managed by the ShaderProgram, ensuring that the location
   * is updated through context loss and restore events.
   * @method uniformVariable
   * @param name {string} The name of the uniform variable.
   */
  uniformLocation(name: string): ShaderUniformLocation;
}

export = ShaderProgram;
