import Color = require('../core/Color');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
/**
 * @class AmbientLight
 * @extends Shareable
 */
declare class AmbientLight extends Shareable implements IFacet {
    /**
     * @property color
     * @type {Color}
     */
    color: Color;
    /**
     * Constructs a white light in the -e3 direction.
     * @class AmbientLight
     * @constructor
     */
    constructor();
    /**
     * @method destructor
     * @type {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = AmbientLight;
