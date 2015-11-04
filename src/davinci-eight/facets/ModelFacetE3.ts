import Color = require('../core/Color')
import Euclidean3 = require('../math/Euclidean3')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import IAnimationTarget = require('../slideshow/IAnimationTarget')
import isUndefined = require('../checks/isUndefined')
import IUnknownExt = require('../core/IUnknownExt')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import ModelE3 = require('../models/ModelE3')
import mustBeString = require('../checks/mustBeString')
import G3 = require('../math/G3')
import R3 = require('../math/R3')
import readOnly = require('../i18n/readOnly');
import Shareable = require('../utils/Shareable')
import Symbolic = require('../core/Symbolic')

/**
 * @class ModelFacetE3
 */
class ModelFacetE3 extends ModelE3 implements IFacet, IAnimationTarget, IUnknownExt<ModelFacetE3> {
    // FIXME: Make this scale so that we can be geometric?
    public static PROP_SCALEXYZ = 'scaleXYZ';

    // FIXME: I don't like this non-geometric scaling.
    private _scaleXYZ: R3 = new R3([1, 1, 1]);
    private matM = Matrix4.one();
    private matN = Matrix3.one();
    private matR = Matrix4.one();
    private matS = Matrix4.one();
    private matT = Matrix4.one();
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the drawable object may represent a rigid body.
     * In Computer Graphics, the drawable object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacetE3 implements IFacet required for manipulating a drawable object.
     * </p>
     * <p>
     * Constructs a ModelFacetE3 at the origin and with unity attitude.
     * </p>
     * @class ModelFacetE3
     * @constructor
     * @param type [string = 'ModelFacetE3'] The name used for reference counting.
     */
    constructor(type: string = 'ModelFacetE3') {
        super(mustBeString('type', type))
        this._scaleXYZ.modified = true
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._scaleXYZ = void 0
        this.matM = void 0
        this.matN = void 0
        this.matR = void 0
        this.matS = void 0
        this.matT = void 0
        super.destructor()
    }

    /**
     * @property scaleXYZ
     * @type R3
     * @readOnly
     */
    get scaleXYZ(): R3 {
        return this._scaleXYZ
    }
    set scaleXYZ(unused) {
        throw new Error(readOnly(ModelFacetE3.PROP_SCALEXYZ).message)
    }

    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number) {
        if (this.X.modified) {
            this.matT.translation(this.X)
            this.X.modified = false
        }
        if (this.R.modified) {
            this.matR.rotation(this.R)
            this.R.modified = false
        }
        if (this.scaleXYZ.modified) {
            this.matS.scaling(this.scaleXYZ)
            this.scaleXYZ.modified = false
        }
        this.matM.copy(this.matT).mul(this.matR).mul(this.matS)

        this.matN.normalFromMatrix4(this.matM)

        visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.matM, canvasId)
        visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.matN, canvasId)
    }
    /**
     * @method incRef
     * @return {ModelFacetE3}
     * @chainable
     */
    incRef(): ModelFacetE3 {
        this.addRef()
        return this
    }
    /**
     * @method decRef
     * @return {ModelFacetE3}
     * @chainable
     */
    decRef(): ModelFacetE3 {
        this.release()
        return this
    }
}

export = ModelFacetE3
