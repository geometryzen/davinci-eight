import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import R2 from '../math/R2';
import Mat2R from '../math/Mat2R';
import readOnly from '../i18n/readOnly';
import Shareable from '../utils/Shareable';

/**
 * @class ReflectionFacetE2
 * @extends Shareable
 */
export default class ReflectionFacetE2 extends Shareable implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R2}
     * @private
     */
    public _normal: R2;
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
        super('ReflectionFacetE2')
        this.name = mustBeString('name', name)
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new R2().zero()
        this._normal.modified = true
    }

    /**
     * @property normal
     * @type R2
     * @readOnly
     */
    get normal(): R2 {
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
