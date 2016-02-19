import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';
import ModelE3 from './ModelE3';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import Vector3 from '../math/Vector3';
import readOnly from '../i18n/readOnly';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ModelFacet
 * @extends ModelE3
 */
export default class ModelFacet extends ModelE3 implements Facet {

    private static PROP_SCALEXYZ = 'scaleXYZ';

    private _scaleXYZ: Vector3 = new Vector3([1, 1, 1]);
    private _matM = Matrix4.one();
    private _matN = Matrix3.one();
    private matR = Matrix4.one();
    private matS = Matrix4.one();
    private matT = Matrix4.one();
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
        this.X.modified = true
        this.R.modified = true
        this._scaleXYZ.modified = true
    }

    /**
     * @property scale
     * @type Vector3
     * @readOnly
     */
    get scale(): Vector3 {
        return this._scaleXYZ
    }
    set scale(unused) {
        throw new Error(readOnly(ModelFacet.PROP_SCALEXYZ).message)
    }

    /**
     * @property matrix
     * @type Matrix4
     * @readOnly
     */
    get matrix(): Matrix4 {
        return this._matM
    }
    set matrix(unused: Matrix4) {
        throw new Error(readOnly('matrix').message)
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        this.updateMatrices()

        visitor.mat4(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, this._matM, false)
        visitor.mat3(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, this._matN, false)
    }

    private updateMatrices(): void {
        let modified = false

        if (this.X.modified) {
            this.matT.translation(this.X)
            this.X.modified = false
            modified = true;
        }
        if (this.R.modified) {
            this.matR.rotation(this.R)
            this.R.modified = false
            modified = true
        }
        if (this.scale.modified) {
            this.matS.scaling(this.scale)
            this.scale.modified = false
            modified = true
        }

        if (modified) {
            this._matM.copy(this.matT).mul(this.matR).mul(this.matS)
            // The normal matrix is computed directly from the model matrix and cached.
            this._matN.normalFromMatrix4(this._matM)
        }
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
