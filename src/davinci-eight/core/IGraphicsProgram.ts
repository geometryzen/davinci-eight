import IResource = require('../core/IResource');
import AttribLocation = require('../core/AttribLocation');
import UniformLocation = require('../core/UniformLocation');
import IFacetVisitor = require('../core/IFacetVisitor');

// FIXME: Handle lists of shaders.

/**
 * <p>
 * The role of a IGraphicsProgram is to manage WebGLProgram(s) consisting of a vertex shader and fragment shader.
 * The Program must be able to provide introspection information that describes the program.
 * </p>
 * @class IGraphicsProgram
 * @extends IResource
 * @extends IFacetVisitor
 * @beta
 */
interface IGraphicsProgram extends IResource, IFacetVisitor {

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
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  use(canvasId?: number): void;

  /**
   * @method attributes
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {{ [name: string]: AttribLocation }}
   */
  attributes(canvasId?: number): { [name: string]: AttribLocation };

  /**
   * @method uniforms
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {{ [name: string]: UniformLocation }}
   */
  uniforms(canvasId?: number): { [name: string]: UniformLocation };

  /**
   * <p>
   * Enables an attribute location of a WebGLProgram.
   * </p>
   * @method enableAttrib
   * @param name {string} The name of the attribute to enable.
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   * @beta
   */
  // FIXME: Can we move to the attribute index?
  enableAttrib(name: string, canvasId?: number): void;

  /**
   * <p>
   * Disables an attribute location of a WebGLProgram.
   * </p>
   * @method disableAttrib
   * @param name {string} The name of the attribute disable.
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   * @beta
   */
  // FIXME: Can we move to the attribute index?
  disableAttrib(name: string, canvasId?: number): void;
}

export = IGraphicsProgram;
