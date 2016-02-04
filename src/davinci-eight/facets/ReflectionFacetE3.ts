import CartesianE3 from '../math/CartesianE3';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import R3 from '../math/R3';
import Mat4R from '../math/Mat4R';
import readOnly from '../i18n/readOnly';
import Shareable from '../utils/Shareable';

/**
 * @class ReflectionFacetE3
 * @extends Shareable
 */
export default class ReflectionFacetE3 extends Shareable implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R3}
     * @private
     */
    public _normal: R3;
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
        super('ReflectionFacetE3')
        this.name = mustBeString('name', name)
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new R3().copy(CartesianE3.zero)
        this._normal.modified = true
    }

    /**
     * @property normal
     * @type R3
     * @readOnly
     */
    get normal(): R3 {
        return this._normal
    }
    set normal(unused) {
        throw new Error(readOnly('normal').message)
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._normal = void 0
        this.matrix = void 0
        super.destructor()
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
