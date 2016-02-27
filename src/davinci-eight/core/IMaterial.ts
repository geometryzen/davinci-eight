import FacetVisitor from './FacetVisitor'
import IContextConsumer from './IContextConsumer'

/**
 * @class IMaterial
 * @extends FacetVisitor
 * @extends IContextConsumer
 */
interface IMaterial extends FacetVisitor, IContextConsumer {

    /**
     * @method use
     * @return {void}
     */
    use(): void
}

export default IMaterial
