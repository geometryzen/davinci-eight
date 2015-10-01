import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import ColorRGB = require('../core/ColorRGB');
import IFacetVisitor = require('../core/IFacetVisitor');
/**
 * @class ColorFacet.
 */
declare class ColorFacet extends Shareable implements ColorRGB, IFacet {
    /**
     * @property colorRGB
     * @type Vector3
     * @private
     */
    private data;
    /**
     * @property name
     * @type {string}
     * @private
     */
    private name;
    /**
     * @class ColorFacet
     * @constructor
     * @param [name = Symbolic.UNIFORM_COLOR]
     */
    constructor(name?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * The red component of the color.
     * @property red
     * @type {number}
     */
    red: number;
    /**
     * The green component of the color.
     * @property green
     * @type {number}
     */
    green: number;
    /**
     * The green component of the color.
     * @property blue
     * @type {number}
     */
    blue: number;
    scale(s: number): ColorFacet;
    setRGB(red: number, green: number, blue: number): ColorFacet;
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = ColorFacet;
