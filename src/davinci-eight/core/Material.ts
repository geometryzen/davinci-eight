import FacetVisitor from './FacetVisitor'
import IContextConsumer from './IContextConsumer'

/**
 * <p>
 * <code>Material</code> is an object-oriented wrapper around a <code>WebGLProgram</code>
 * <p/>
 *
 * @class Material
 * @extends FacetVisitor
 * @extends IContextConsumer
 */
interface Material extends FacetVisitor, IContextConsumer {

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

export default Material
