import DrawMode from './DrawMode';
import Shareable from './Shareable';

/**
 * @module EIGHT
 * @submodule core
 * @class ContextProvider
 * @extends Shareable
 */
interface ContextProvider extends Shareable {
  /**
   * @property gl
   * @type {WebGLRenderingContext}
   * @readOnly
   */
  gl: WebGLRenderingContext;

  /**
   * @method disableVertexAttribArray
   * @param index {number}
   * @return {void}
   */
  disableVertexAttribArray(index: number): void;

  /**
   * Render geometric primitives from bound and enabled vertex data.
   *
   * @method drawArrays
   * @param mode {number} Specifies the kind of geometric primitives to render from a given set of vertex attributes.
   * @param first {number} The first element to render in the array of vector points.
   * @param count {number} The number of vector points to render. For example, a triangle would be 3.
   * @return {void}
   */
  drawArrays(mode: number, first: number, count: number): void

  /**
   * @method drawElements
   * @param mode {number}
   * @param count {number}
   * @param offset {number}
   * @return {void}
   */
  drawElements(mode: number, count: number, offset: number): void

  /**
   * @method drawModeToGL
   * @param drawMode {DrawMode}
   * @return {number}
   */
  drawModeToGL(drawMode: DrawMode): number

  /**
   * @method enableVertexAttribArray
   * @param index {number}
   * @return {void}
   */
  enableVertexAttribArray(index: number): void;

  /**
   * @method isContextLost
   * @return boolean
   */
  isContextLost(): boolean;

  /**
   * @method vertexAttribPointer
   * @param index {number}
   * @param size {number}
   * @param normalized {boolean}
   * @param stride {number}
   * @param offset {number}
   * @return {void}
   */
  vertexAttribPointer(index: number, size: number, normalized: boolean, stride: number, offset: number): void;
}

export default ContextProvider;
