import Color = require('../core/Color')
import Matrix3 = require('../math/Matrix3')
import Matrix4 = require('../math/Matrix4')
import readOnly = require('../i18n/readOnly');
import Shareable = require('../utils/Shareable')
import Spinor3 = require('../math/Spinor3')
import Symbolic = require('../core/Symbolic')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import IProperties = require('../slideshow/IProperties')
import Vector3 = require('../math/Vector3')

/**
 * @class ModelFacet
 */
class ModelFacet extends Shareable implements IFacet, IProperties {

  public static PROP_ATTITUDE = 'attitude';
  public static PROP_POSITION = 'position';

  private _position = new Vector3();
  private _attitude = new Spinor3();
  private _scaleXYZ: Vector3 = new Vector3([1, 1, 1]);
  private M = Matrix4.identity();
  private N = Matrix3.identity();
  private R = Matrix4.identity();
  private S = Matrix4.identity();
  private T = Matrix4.identity();
  /**
   * ModelFacet implements IFacet required for manipulating a body.
   * @class ModelFacet
   * @constructor
   */
  constructor() {
    super('ModelFacet')
    this._position.modified = true
    this._attitude.modified = true
    this._scaleXYZ.modified = true
  }
  /**
   * @method destructor
   * @return {void}
   */
  protected destructor(): void {
    this._position = void 0
    this._attitude = void 0
    this._scaleXYZ = void 0
    this.M = void 0
    this.N = void 0
    this.R = void 0
    this.S = void 0
    this.T = void 0
  }
  /**
   * @property attitude
   * @type Spinor3
   * @readOnly
   */
  get attitude(): Spinor3 {
    return this._attitude
  }
  set attitude(unused) {
    throw new Error(readOnly('attitude').message)
  }
  /**
   * @property position
   * @type Vector3
   * @readOnly
   */
  get position(): Vector3 {
  return this._position
  }
  set position(unused) {
    throw new Error(readOnly('position').message)
  }
  /**
   * @property scaleXYZ
   * @type Vector3
   * @readOnly
   */
  get scaleXYZ(): Vector3 {
    return this._scaleXYZ
  }
  set scaleXYZ(unused) {
    throw new Error(readOnly('scaleXYZ').message)
  }
  /**
   * @method getProperty
   * @param name {string}
   * @return {number[]}
   */
  getProperty(name: string): number[] {
    switch(name) {
      case ModelFacet.PROP_ATTITUDE: {
        return this._attitude.data
      }
      case ModelFacet.PROP_POSITION: {
        return this._position.data
      }
      default: {
        console.warn("ModelFacet.getProperty " + name)
        return void 0
      }
    }
  }
  /**
   * @method setProperty
   * @param name {string}
   * @param data {number[]}
   * @return {void}
   */
  setProperty(name: string, data: number[]): void {
    switch(name) {
      case ModelFacet.PROP_ATTITUDE: {
        this._attitude.yz = data[0]
        this._attitude.zx = data[1]
        this._attitude.xy = data[2]
        this._attitude.w = data[3]
      }
      break;
      case ModelFacet.PROP_POSITION: {
        this._position.set(data[0], data[1], data[2])
      }
      break;
      default: {
        console.warn("ModelFacet.setProperty " + name)
      }
    }
  }
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param canvasId {number}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number) {
    if (!this.position) {
      console.warn("setUniforms called on zombie ModelFacet")
      return
    }
    if (this._position.modified) {
      this.T.translation(this._position)
      this._position.modified = false
    }
    if (this._attitude.modified) {
        this.R.rotation(this._attitude)
        this._attitude.modified = false
    }
    if (this.scaleXYZ.modified) {
      this.S.scaling(this.scaleXYZ)
      this.scaleXYZ.modified = false
    }
    this.M.copy(this.T).multiply(this.R).multiply(this.S)

    this.N.normalFromMatrix4(this.M)

    visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.M, canvasId)
    visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N, canvasId)
  }
}

export = ModelFacet
