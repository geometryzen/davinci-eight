import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import R3 = require('../math/R3');
import Shareable = require('../utils/Shareable');
/**
 * @class ReflectionFacetE3
 * @extends Shareable
 */
declare class ReflectionFacetE3 extends Shareable implements IFacet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R3}
     * @private
     */
    _normal: R3;
    /**
     * @property matrix
     * @type {Matrix4}
     * @private
     */
    private matrix;
    private name;
    /**
     * @class ReflectionFacetE3
     * @constructor
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string);
    /**
     * @property normal
     * @type R3
     * @readOnly
     */
    normal: R3;
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method getProperty
     * @param name {string}
     * @return {Array<number>}
     */
    getProperty(name: string): Array<number>;
    /**
     * @method setProperty
     * @param name {string}
     * @param value {Array<number>}
     * @return {void}
     */
    setProperty(name: string, value: Array<number>): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
}
export = ReflectionFacetE3;
