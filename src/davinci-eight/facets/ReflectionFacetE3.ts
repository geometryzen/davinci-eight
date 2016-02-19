import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import G3m from '../math/G3m';
import Matrix4 from '../math/Matrix4';
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
     *
     * @property _normal
     * @type {G3m}
     * @private
     */
    // FIXME: Maybe use an Vector3 here instead?
    public _normal: G3m;

    /**
     * @property matrix
     * @type {Matrix4}
     * @private
     */
    private matrix = Matrix4.one();
    private name: string;

    /**
     * @class ReflectionFacetE3
     * @constructor
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string) {
        this.name = mustBeString('name', name)
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = G3m.zero()
        this._normal.modified = true
    }

    /**
     * @property normal
     * @type G3m
     * @readOnly
     */
    get normal(): G3m {
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
