import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';
import ModelE3 from './ModelE3';
import mustBeArray from '../checks/mustBeArray';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import Spinor3 from '../math/Spinor3';
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

    /**
     * @property _stress
     * @type Vector3
     * @private
     */
    private _stress: Vector3 = new Vector3([1, 1, 1]);

    /**
     * The tilt is the spinor that rotates the object from
     * the coordinate frame used for scaling to the local coordinate
     * frame of the object. We want the scaling to work relative to the
     * local coordinate frame of the object.
     *
     * @property _tilt
     * @type Spinor3
     * @private
     */
    private _tilt = Spinor3.one();

    private _matM = Matrix4.one();
    private _matN = Matrix3.one();
    private matR = Matrix4.one();
    private matS = Matrix4.one();
    private matT = Matrix4.one();

    /**
     * @property matK
     * @type Matrix4
     * @private
     */
    private matK = Matrix4.one();

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
        this.position.modified = true
        this.attitude.modified = true
        this._stress.modified = true
    }

    /**
     * The spinor that rotates the object from the 'XYZ' frame used for scaling
     * to the reference (initial) frame of the object.
     *
     * @property tilt
     * @type Spinor3
     */
    get tilt(): Spinor3 {
        return this._tilt
    }
    set tilt(tilt: Spinor3) {
        mustBeObject('tilt', tilt)
        this._tilt.copy(tilt)
    }

    /**
     * @property scale
     * @type Vector3
     */
    get scale(): Vector3 {
        return this._stress
    }
    set scale(scale: Vector3) {
        mustBeObject('scale', scale)
        this._stress.copy(scale)
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

        if (this.position.modified) {
            this.matT.translation(this.position)
            this.position.modified = false
            modified = true;
        }
        if (this.attitude.modified) {
            this.matR.rotation(this.attitude)
            this.attitude.modified = false
            modified = true
        }
        if (this._stress.modified || this.tilt.modified) {
            this.matK.rotation(this.tilt)
            this.matS.scaling(this._stress)
            this.matS.mul2(this.matK, this.matS).mul(this.matK.inv())
            this._stress.modified = false
            this.tilt.modified = true
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
