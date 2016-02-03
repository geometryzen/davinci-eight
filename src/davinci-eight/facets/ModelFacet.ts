import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import IAnimationTarget from '../slideshow/IAnimationTarget';
import IUnknownExt from '../core/IUnknownExt';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import ModelE3 from '../models/ModelE3';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import R3 from '../math/R3';
import readOnly from '../i18n/readOnly';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * @class ModelFacet
 */
export default class ModelFacet extends ModelE3 implements Facet, IAnimationTarget, IUnknownExt<ModelFacet> {
    // FIXME: Make this scale so that we can be geometric?
    public static PROP_SCALEXYZ = 'scaleXYZ';

    // FIXME: I don't like this non-geometric scaling.
    private _scaleXYZ: R3 = new R3([1, 1, 1]);
    private matM = Mat4R.one();
    private matN = Mat3R.one();
    private matR = Mat4R.one();
    private matS = Mat4R.one();
    private matT = Mat4R.one();
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the drawable object may represent a rigid body.
     * In Computer Graphics, the drawable object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements Facet required for manipulating a drawable object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     * @class ModelFacet
     * @constructor
     * @param [type = 'ModelFacet'] {string} The name used for reference counting.
     */
    constructor(type = 'ModelFacet') {
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
        throw new Error(readOnly(ModelFacet.PROP_SCALEXYZ).message)
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @param canvasId {number}
     */
    setUniforms(visitor: FacetVisitor, canvasId: number) {
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

        this.matN.normalFromMat4R(this.matM)

        visitor.mat4(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, this.matM, false, canvasId)
        visitor.mat3(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, this.matN, false, canvasId)
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {ModelFacet}
     * @chainable
     */
    setProperty(name: string, data: number[]): ModelFacet {
        mustBeString('name', name);
        mustBeArray('data', data);
        super.setProperty(name, data);
        return this;
    }

    /**
     * @method incRef
     * @return {ModelFacet}
     * @chainable
     */
    incRef(): ModelFacet {
        this.addRef()
        return this
    }

    /**
     * @method decRef
     * @return {ModelFacet}
     * @chainable
     */
    decRef(): ModelFacet {
        this.release()
        return this
    }
}
