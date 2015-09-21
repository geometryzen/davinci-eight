import IResource = require('../core/IResource');
import AttribLocation = require('../core/AttribLocation');
import UniformLocation = require('../core/UniformLocation');
import UniformDataVisitor = require('../core/UniformDataVisitor');

// FIXME: Handle lists of shaders.

/**
 * <p>
 * The role of a IProgram is to manage WebGLProgram(s) consisting of a vertex shader and fragment shader.
 * The Program must be able to provide introspection information that describes the program.
 * </p>
 * @class IProgram
 * @extends IResource
 * @extends UniformDataVisitor
 */
interface IProgram extends IResource, UniformDataVisitor {
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
   * @param canvasId {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  use(canvasId: number): void;
  /**
   * @property attributeLocations
   * @type { [name: string]: AttribLocation }
   */
  attributes: { [name: string]: AttribLocation };
  /**
   * @property uniforms
   * @type { [name: string]: UniformLocation }
   */
  uniforms: { [name: string]: UniformLocation };
  /**
   * <p>
   * Enables an attribute location of a WebGLProgram.
   * </p>
   * @method enableAttrib
   * @param name {string} The name of the attribute to enable.
   * @beta
   */
  // FIXME: This should take a canvasId.
  // FIXME: Can we move to the attribute index?
  enableAttrib(name: string): void;
  /**
   * <p>
   * Enables an attribute location of a WebGLProgram.
   * </p>
   * @method disableAttrib
   * @param name {string} The name of the attribute disable.
   * @beta
   */
  disableAttrib(name: string): void;
}

export = IProgram;
