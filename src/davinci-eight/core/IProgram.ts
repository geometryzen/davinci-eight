import IResource = require('../core/IResource');
import AttribLocation = require('../core/AttribLocation');
import UniformLocation = require('../core/UniformLocation');
import UniformDataVisitor = require('../core/UniformDataVisitor');

// FIXME: Handle lists of shaders.

/**
 * The role of a IProgram is to manage WebGLProgram(s) consisting of a vertex shader and fragment shader.
 * The Program must be able to provide introspection information that describes the program.
 * @interface IProgram
 * @extends IResource
 * @extends UniformDataVisitor
 */
interface IProgram extends IResource, UniformDataVisitor {
  /**
   * @property program
   * @type WebGLProgram
   * FIXME: This will neet to be a getWebGLProgram(canvasId).
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
   * @param canvasId {number} Determines which WebGLProgram to use.
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
   *
   */
  enableAttrib(name: string): void;
  /**
   *
   */
  disableAttrib(name: string): void;
}

export = IProgram;
