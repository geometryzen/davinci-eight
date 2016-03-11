import Facet from '../core/Facet'
import FacetVisitor from '../core/FacetVisitor'
import Matrix3 from '../math/Matrix3'
import Matrix4 from '../math/Matrix4'
import ModelE3 from './ModelE3'
import mustBeArray from '../checks/mustBeArray'
import mustBeObject from '../checks/mustBeObject'
import mustBeString from '../checks/mustBeString'
import readOnly from '../i18n/readOnly'
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'

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
   * @property matS
   * @type Matrix4
   * @default diag(1, 1, 1, 1)
   * @private
   */
  private matS: Matrix4 = Matrix4.one();

  private _matM = Matrix4.one()
  private _matN = Matrix3.one()
  private matR = Matrix4.one()
  private matT = Matrix4.one()

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
    this.matS.modified = true
  }

  /**
   * @property stress
   * @type Matrix4
   */
  get stress(): Matrix4 {
    return this.matS
  }
  set stress(stress: Matrix4) {
    mustBeObject('stress', stress)
    this.matS.copy(stress)
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
    if (this.matS.modified) {
      modified = true
    }

    if (modified) {
      this._matM.copy(this.matT).mul(this.matR).mul(this.matS)
      if (this._matM.det() !== 0) {
        this._matN.normalFromMatrix4(this._matM)
      }
      else {
        // If the scaling matrix determinant is zero, so too will be the matrix M.
        // If M is singular then it will not be possible to compute the matrix for transforming normals.
        // In any case, the geometry not be visible.
        // So we just set the normals matrix to the identity.
        this._matN.one()
      }
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
