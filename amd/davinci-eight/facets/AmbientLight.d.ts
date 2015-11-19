import Color = require('../core/Color');
import ColorRGB = require('../core/ColorRGB');
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
    constructor(color: ColorRGB);
    /**
     * @method destructor
     * @type {void}
     * @protected
     */
    protected destructor(): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param [canvasId] {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId?: number): void;
}
export = AmbientLight;
