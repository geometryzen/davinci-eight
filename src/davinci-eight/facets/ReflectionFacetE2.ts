import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import R2m from '../math/R2m';
import Mat2R from '../math/Mat2R';
import readOnly from '../i18n/readOnly';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ReflectionFacetE2
 */
export default class ReflectionFacetE2 implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R2m}
     * @private
     */
    public _normal: R2m;
    /**
     * @property matrix
     * @type {Mat2R}
     * @private
     */
    private matrix = Mat2R.one();
    private name: string;

    /**
     * @class ReflectionFacetE2
     * @constructor
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string) {
        this.name = mustBeString('name', name)
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new R2m().zero()
        this._normal.modified = true
    }

    /**
     * @property normal
     * @type R2m
     * @readOnly
     */
    get normal(): R2m {
        return this._normal
    }
    set normal(unused) {
        throw new Error(readOnly('normal').message)
    }

    /**
     * @method getProperty
     * @param name {string}
     * @return {Array<number>}
     */
    getProperty(name: string): Array<number> {
        mustBeString('name', name)
        return void 0;
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param value {Array<number>}
     * @return {void}
     */
    setProperty(name: string, value: Array<number>): ReflectionFacetE2 {
        mustBeString('name', name)
        mustBeArray('value', value)
        return this;
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal)
            this._normal.modified = false
        }
        visitor.mat2(this.name, this.matrix, false)
    }
}
