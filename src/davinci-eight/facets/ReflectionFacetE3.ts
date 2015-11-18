import CartesianE3 = require('../math/CartesianE3')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeArray = require('../checks/mustBeArray')
import mustBeString = require('../checks/mustBeString')
import R3 = require('../math/R3')
import Matrix4 = require('../math/Matrix4')
import readOnly = require('../i18n/readOnly');
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')

/**
 * @class ReflectionFacetE3
 * @extends Shareable
 */
class ReflectionFacetE3 extends Shareable implements IFacet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R3}
     * @private
     */
    public _normal: R3;
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
    setProperty(name: string, value: Array<number>): void {
        mustBeString('name', name)
        mustBeArray('value', value)
    }

    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal)
            this._normal.modified = false
        }
        visitor.uniformMatrix4(this.name, false, this.matrix, canvasId)
    }
}

export = ReflectionFacetE3