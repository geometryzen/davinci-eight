import Color = require('../core/Color');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import Shareable = require('../utils/Shareable');
import Vector3 = require('../math/Vector3');
/**
 * @class DirectionalLight
 * @extends Shareable
 */
declare class DirectionalLight extends Shareable implements IFacet {
    /**
     * @property direction
     * @type {Vector3}
     */
    direction: Vector3;
    /**
     * @property color
     * @type {Color}
     */
    color: Color;
    /**
     * Constructs a white light in the -e3 direction.
     * @class DirectionalLight
     * @constructor
     */
    constructor();
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
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = DirectionalLight;
