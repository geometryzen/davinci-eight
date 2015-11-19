import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeArray = require('../checks/mustBeArray')
import mustBeString = require('../checks/mustBeString')
import R2 = require('../math/R2')
import Matrix2 = require('../math/Matrix2')
import readOnly = require('../i18n/readOnly');
import Shareable = require('../utils/Shareable')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')

/**
 * @class ReflectionFacetE2
 * @extends Shareable
 */
class ReflectionFacetE2 extends Shareable implements IFacet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     * @property _normal
     * @type {R2}
     * @private
     */
    public _normal: R2;
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
    setProperty(name: string, value: Array<number>): void {
        mustBeString('name', name)
        mustBeArray('value', value)
    }

    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param [canvasId] {number} Determines which WebGLProgram to use.
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId?: number): void {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal)
            this._normal.modified = false
        }
        visitor.uniformMatrix2(this.name, false, this.matrix, canvasId)
    }
}

export = ReflectionFacetE2