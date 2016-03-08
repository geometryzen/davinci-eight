import FacetVisitor from './FacetVisitor';
import ContextConsumer from './ContextConsumer';
import UniformLocation from './UniformLocation';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * <code>AbstractMaterial</code> is an object-oriented wrapper around a <code>WebGLProgram</code>
 * <p/>
 *
 * @class AbstractMaterial
 * @extends FacetVisitor
 * @extends ContextConsumer
 */
interface AbstractMaterial extends FacetVisitor, ContextConsumer {

  /**
   * @property vertexShaderSrc
   * @type string
   */
  vertexShaderSrc: string

  /**
   * @property fragmentShaderSrc
   * @type string
   */
  fragmentShaderSrc: string

  /**
   * @method getAttribLocation
   * @param name {string}
   * @return {number}
   */
  getAttribLocation(name: string): number

  /**
   * @method getUniformLocation
   * @param name {string}
   * @return {UniformLocation}
   */
  getUniformLocation(name: string): UniformLocation

  /**
   * @method use
   * @return {void}
   */
  use(): void
}

export default AbstractMaterial
