import Cartesian3 = require('../math/Cartesian3')
import IContextProvider = require('../core/IContextProvider')
import IMaterial = require('../core/IMaterial')
import createPerspective = require('../cameras/createPerspective')
import isDefined = require('../checks/isDefined')
import isInteger = require('../checks/isInteger')
import readOnly = require('../i18n/readOnly')
import mustBeCanvasId = require('../checks/mustBeCanvasId')
import mustBeDefined = require('../checks/mustBeDefined')
import mustBeNumber = require('../checks/mustBeNumber')
import Perspective = require('../cameras/Perspective')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import uuid4 = require('../utils/uuid4')
import Vector3 = require('../math/Vector3')

/**
 * Name used for reference count monitoring and logging.
 */
let CLASS_NAME = 'PerspectiveCamera'

/**
 * @class PerspectiveCamera
 */
class PerspectiveCamera extends Shareable implements Perspective, IFacet {
  // FIXME: Gotta go
  public position: Vector3 = new Vector3();
  /**
   * @property material
   * @type {IMaterial}
   */
  public material: IMaterial;
  /**
   * @property name
   * @type [string]
   */
  public name: string;
  /**
   *
   */
  private inner: Perspective;
  /**
   * <p>
   * 
   * </p>
   * @class PerspectiveCamera
   * @constructor
   * @param [fov = 75 * Math.PI / 180] {number}
   * @param [aspect=1] {number}
   * @param [near=0.1] {number}
   * @param [far=2000] {number}
   * @example
   *   var camera = new EIGHT.PerspectiveCamera()
   *   camera.setAspect(canvas.clientWidth / canvas.clientHeight)
   *   camera.setFov(3.0 * e3)
   */
  constructor(fov: number = 75 * Math.PI / 180, aspect: number = 1, near: number = 0.1, far: number = 2000) {
    super('PerspectiveCamera')
    mustBeNumber('fov', fov)
    mustBeNumber('aspect', aspect)
    mustBeNumber('near', near)
    mustBeNumber('far', far)
    this.inner = createPerspective({fov: fov, aspect: aspect, near: near, far: far})
  }
  protected destructor(): void {

  }
  /**
   * @method setUniforms
   * @param visitor {IFacetVisitor}
   * @param canvasId {number}
   * @return {void}
   */
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    this.inner.setNear(this.near)
    this.inner.setFar(this.far)
    this.inner.setUniforms(visitor, canvasId)
  }
  contextFree(): void {
  }
  contextGain(manager: IContextProvider): void {
  }
  contextLost(): void {
  }
  draw(canvasId: number): void {
    console.warn(CLASS_NAME + ".draw(" + canvasId + ")")
    // Do nothing.
  }
  getProperty(name: string): number[] {
    return void 0;
  }
  setProperty(name: string, value: number[]): void {
  }
  /**
   * The aspect ratio (width / height) of the camera viewport.
   * @property aspect
   * @type {number}
   * @readOnly
   */
  get aspect(): number {
    return this.inner.aspect
  }
  /**
   * @method setAspect
   * @param aspect {number}
   * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
   * @chainable
   */
  setAspect(aspect: number): PerspectiveCamera {
    this.inner.aspect = aspect
    return this
  }
  /**
   * The position of the camera.
   * @property eye
   * @type {Vector3}
   * @readOnly
   */
  get eye(): Vector3 {
    return this.inner.eye
  }
  /**
   * @method setEye
   * @param eye {Cartesian3}
   * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
   * @chainable
   */
  setEye(eye: Cartesian3): PerspectiveCamera {
    this.inner.setEye(eye)
    return this
  }
  /**
   * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
   * Measured in radians.
   * @property fov
   * @type {number}
   * @readOnly
   */
  // TODO: Field of view could be specified as an Aspect + Magnitude of a Spinor3!?
  get fov(): number {
    return this.inner.fov
  }
  set fov(unused: number) {
    throw new Error(readOnly('fov').message)
  }
  /**
   * @method setFov
   * @param fov {number}
   * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
   * @chainable
   */
  setFov(fov: number): PerspectiveCamera {
    mustBeNumber('fov', fov)
    this.inner.fov = fov
    return this
  }
  get look() {
    return this.inner.look
  }
  setLook(look: Cartesian3): PerspectiveCamera {
    this.inner.setLook(look)
    return this
  }

  /**
   * The distance to the near plane.
   * @property near
   * @type {number}
   * @readOnly
   */
  get near(): number {
    return this.inner.near
  }
  set near(unused) {
    throw new Error(readOnly('near').message)
  }
  /**
   * @method setNear
   * @param near {number}
   * @return {PerspectiveCamera} <p><code>this</code> instance, <em>without incrementing the reference count</em>.</p>
   * @chainable
   */
  setNear(near: number): PerspectiveCamera {
    this.inner.setNear(near)
    return this
  }
  get far(): number {
    return this.inner.far
  }
  set far(far: number) {
    this.inner.far = far
  }
  setFar(far: number): PerspectiveCamera {
    this.inner.setFar(far)
    return this
  }
  get up(): Vector3 {
    return this.inner.up
  }
  set up(unused) {
    throw new Error(readOnly('up').message)
  }
  setUp(up: Cartesian3): PerspectiveCamera {
    this.inner.setUp(up)
    return this
  }
}

export = PerspectiveCamera
