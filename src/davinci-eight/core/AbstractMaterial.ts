import FacetVisitor from './FacetVisitor'
import ContextConsumer from './ContextConsumer'

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
   * @method use
   * @return {void}
   */
  use(): void
}

export default AbstractMaterial
