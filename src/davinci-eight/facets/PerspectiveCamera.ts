import createPerspective from './createPerspective';
import readOnly from '../i18n/readOnly';
import mustBeObject from '../checks/mustBeObject';
import mustBeGE from '../checks/mustBeGE';
import mustBeLE from '../checks/mustBeLE';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import Perspective from './Perspective';
import R3 from '../math/R3';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';
import Matrix4 from '../math/Matrix4';

/**
 * Common abstractions for computing shader uniform variables.
 *
 * @module EIGHT
 * @submodule facets
 */

/**
 * <p>
 * The <code>PerspectiveCamera</code> provides projection matrix and view matrix uniforms to the
 * current <code>Material</code>.
 * </p>
 * <p>
 * The <code>PerspectiveCamera</code> plays the role of a host in the <em>Visitor</em> pattern.
 * The <code>FacetVistor</code> will normally be a <code>Material</code> implementation. The  accepting
 * method is called <code>setUniforms</code>.
 * <p>
 *
 * @example
 *     const ambients: Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.aspect = canvas.clientWidth / canvas.clientHeight
 *     camera.position = Vector3.copy(R3.e3)
 *     ambients.push(camera)
 *
 *     scene.draw(ambients)
 *
 * The camera is initially positioned at 10 * e3
 *
 * @class PerspectiveCamera
 * @extends Perspective
 * @extends Facet
 */
export default class PerspectiveCamera implements Perspective, Facet {

  /**
   * The name of the property that designates the position.
   *
   * @property PROP_POSITION
   * @type {string}
   * @default 'X'
   * @static
   * @readOnly
   */
  public static PROP_POSITION = 'X';
  public static PROP_EYE = 'eye';

  /**
   * @property name
   * @type {string}
   */
  public name: string;

  /**
   * @property inner
   * @type {Perspective}
   * @private
   */
  private inner: Perspective;

  /**
   * @class PerspectiveCamera
   * @constructor
   * @param [fov = 45 * Math.PI / 180] {number} The field of view.
   * @param [aspect=1] {number} The aspect is the ratio width / height.
   * @param [near=0.1] {number} The distance of the near plane from the camera.
   * @param [far=2000] {number} The distance of the far plane from the camera. 
   */
  constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 2000) {

    mustBeNumber('fov', fov)
    mustBeGE('fov', fov, 0)
    mustBeLE('fov', fov, Math.PI)

    mustBeNumber('aspect', aspect)
    mustBeGE('aspect', aspect, 0)

    mustBeNumber('near', near)
    mustBeGE('near', near, 0)

    mustBeNumber('far', far)
    mustBeGE('far', far, 0)

    this.inner = createPerspective({ fov: fov, aspect: aspect, near: near, far: far })

    this.position.copy(R3.e3).scale(10)
  }

  /**
   * @method setUniforms
   * @param visitor {FacetVisitor}
   * @return {void}
   */
  setUniforms(visitor: FacetVisitor): void {
    // Synchronize the near and far properties before delegating.
    this.inner.setNear(this.near)
    this.inner.setFar(this.far)
    this.inner.setUniforms(visitor)
  }

  /**
   * @method getProperty
   * @param name {string}
   * @return {number[]}
   */
  getProperty(name: string): number[] {
    mustBeString('name', name);
    switch (name) {
      case PerspectiveCamera.PROP_EYE:
      case PerspectiveCamera.PROP_POSITION: {
        return this.eye.coords;
      }
      default: {
        // TODO
      }
    }
  }

  /**
   * @method setProperty
   * @param name {string}
   * @param value {number[]}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setProperty(name: string, value: number[]): PerspectiveCamera {
    mustBeString('name', name);
    mustBeObject('value', value);
    switch (name) {
      case PerspectiveCamera.PROP_EYE:
      case PerspectiveCamera.PROP_POSITION: {
        this.eye.copyCoordinates(value);
      }
        break;
      default: {
        // TODO
      }
    }
    return this;
  }

  /**
   * The aspect ratio (width / height) of the camera viewport.
   *
   * @property aspect
   * @type {number}
   * @readOnly
   */
  get aspect(): number {
    return this.inner.aspect;
  }

  /**
   * @method setAspect
   * @param aspect {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setAspect(aspect: number): PerspectiveCamera {
    this.inner.aspect = aspect;
    return this;
  }

  /**
   * The position of the camera.
   * @property eye
   * @type {Vector3}
   */
  get eye(): Vector3 {
    return this.inner.eye;
  }
  set eye(eye: Vector3) {
    this.inner.eye.copy(eye);
  }

  /**
   * The position of the camera.
   * @property position
   * @type {Vector3}
   * @readOnly
   */
  get position(): Vector3 {
    return this.inner.eye;
  }
  set position(position: Vector3) {
    this.inner.eye.copy(position);
  }

  /**
   * @method setEye
   * @param eye {VectorE3}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setEye(eye: VectorE3): PerspectiveCamera {
    this.inner.setEye(eye);
    return this;
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
    return this.inner.fov;
  }
  set fov(unused: number) {
    throw new Error(readOnly('fov').message);
  }
  /**
   * @method setFov
   * @param fov {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setFov(fov: number): PerspectiveCamera {
    mustBeNumber('fov', fov);
    this.inner.fov = fov;
    return this;
  }

  get look(): Vector3 {
    return this.inner.look;
  }
  setLook(look: VectorE3): PerspectiveCamera {
    this.inner.setLook(look);
    return this;
  }

  /**
   * The distance to the near plane.
   * @property near
   * @type {number}
   * @readOnly
   */
  get near(): number {
    return this.inner.near;
  }
  set near(unused) {
    throw new Error(readOnly('near').message);
  }

  /**
   * @method setNear
   * @param near {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setNear(near: number): PerspectiveCamera {
    this.inner.setNear(near);
    return this;
  }

  get far(): number {
    return this.inner.far;
  }
  set far(far: number) {
    this.inner.far = far;
  }

  setFar(far: number): PerspectiveCamera {
    this.inner.setFar(far);
    return this;
  }

  get up(): Vector3 {
    return this.inner.up;
  }
  set up(unused) {
    throw new Error(readOnly('up').message);
  }

  setUp(up: VectorE3): PerspectiveCamera {
    this.inner.setUp(up);
    return this;
  }

  get projectionMatrix(): Matrix4 {
    return this.inner.projectionMatrix
  }
  set projectionMatrix(projectionMatrix: Matrix4) {
    throw new Error(readOnly('projectionMatrix').message);
  }

  /**
   * @property viewMatrix
   * @type Matrix4
   * @readOnly
   */
  get viewMatrix(): Matrix4 {
    return this.inner.viewMatrix
  }
  set viewMatrix(viewMatrix: Matrix4) {
    this.inner.viewMatrix = viewMatrix
  }
}
