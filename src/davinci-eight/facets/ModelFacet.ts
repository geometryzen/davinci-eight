import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import ModelE3 from './ModelE3';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import R3 from '../math/R3';
import readOnly from '../i18n/readOnly';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ModelFacet
 */
export default class ModelFacet extends ModelE3 implements Facet {

    public static PROP_SCALEXYZ = 'scaleXYZ';

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
     * In Physics, the composite object may represent a rigid body.
     * In Computer Graphics, the composite object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     * @class ModelFacet
     * @constructor
     */
    constructor() {
        super()
        this._scaleXYZ.modified = true
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
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
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

        visitor.mat4(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, this.matM, false)
        visitor.mat3(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, this.matN, false)
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
}
