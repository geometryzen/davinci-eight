import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import G3 from '../math/G3';
import Mat4R from '../math/Mat4R';
import readOnly from '../i18n/readOnly';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ReflectionFacetE3
 */
export default class ReflectionFacetE3 implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {G3}
     * @private
     */
    public _normal: G3;

    /**
     * @property matrix
     * @type {Mat4R}
     * @private
     */
    private matrix = Mat4R.one();
    private name: string;

    /**
     * @class ReflectionFacetE3
     * @constructor
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string) {
        this.name = mustBeString('name', name)
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = G3.fromVector({ x: 0, y: 0, z: 0 })
        this._normal.modified = true
    }

    /**
     * @property normal
     * @type G3
     * @readOnly
     */
    get normal(): G3 {
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
    setProperty(name: string, value: Array<number>): ReflectionFacetE3 {
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
        visitor.mat4(this.name, this.matrix, false)
    }
}
