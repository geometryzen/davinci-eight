import FacetVisitor from './FacetVisitor'
import IContextConsumer from './IContextConsumer'

/**
 * @class Material
 * @extends FacetVisitor
 * @extends IContextConsumer
 */
interface Material extends FacetVisitor, IContextConsumer {

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
