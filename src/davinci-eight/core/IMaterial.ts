import FacetVisitor from './FacetVisitor'
import IUnknown from './IUnknown'

/**
 * @class IMaterial
 * @extends FacetVisitor
 * @extends IUnknown
 */
interface IMaterial extends FacetVisitor, IUnknown {

    /**
     * @method use
     * @return {void}
     */
    use(): void
}

export default IMaterial
