import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import R2 = require('../math/R2');
import Shareable = require('../utils/Shareable');
/**
 * @class ReflectionFacetE2
 * @extends Shareable
 */
declare class ReflectionFacetE2 extends Shareable implements IFacet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R2}
     * @private
     */
    _normal: R2;
    /**
     * @property matrix
     * @type {Matrix2}
     * @private
     */
    private matrix;
    private name;
    /**
     * @class ReflectionFacetE2
     * @constructor
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string);
    /**
     * @property normal
     * @type R2
     * @readOnly
     */
    normal: R2;
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
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId?: number): void;
}
export = ReflectionFacetE2;
