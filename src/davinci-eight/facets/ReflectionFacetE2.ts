import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';
import mustBeString from '../checks/mustBeString';
import {Vector2} from '../math/Vector2';
import Matrix2 from '../math/Matrix2';
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
     * @type {Vector2}
     * @private
     */
    public _normal: Vector2;
    /**
     * @property matrix
     * @type {Matrix2}
     * @private
     */
    private matrix = Matrix2.one();
    private name: string;

    /**
     * @class ReflectionFacetE2
     * @constructor
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string) {
        this.name = mustBeString('name', name)
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new Vector2().zero()
        this._normal.modified = true
    }

    /**
     * @property normal
     * @type Vector2
     * @readOnly
     */
    get normal(): Vector2 {
        return this._normal
    }
    set normal(unused) {
        throw new Error(readOnly('normal').message)
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
        visitor.matrix2fv(this.name, this.matrix.elements, false)
    }
}
