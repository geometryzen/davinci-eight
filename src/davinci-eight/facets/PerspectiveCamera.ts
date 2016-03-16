import createPerspective from './createPerspective';
import Geometric3 from '../math/Geometric3';
import readOnly from '../i18n/readOnly';
import mustBeObject from '../checks/mustBeObject';
import mustBeGE from '../checks/mustBeGE';
import mustBeLE from '../checks/mustBeLE';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import Perspective from './Perspective';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import VectorE3 from '../math/VectorE3';

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
 *     camera.eye = Geometric3.copyVector(R3.e3)
 *     ambients.push(camera)
 *
 *     scene.draw(ambients)
 *
 * The camera is initially positioned at e3
 *
 * @class PerspectiveCamera
 */
export default class PerspectiveCamera implements Perspective, Facet {

  /**
   * The name of the property that designates the position.
   *
   * @property PROP_POSITION
   * @type string
   * @default 'X'
   * @static
   * @readOnly
   * @private
   */
  private static PROP_POSITION = 'X';

  /**
   * @property PROP_EYE
   * @type string
   * @default 'eye'
   * @static
   * @readOnly
   * @private
   */
  private static PROP_EYE = 'eye';

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
   * @param [far=1000] {number} The distance of the far plane from the camera. 
   */
  constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 1000) {

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
    mustBeString('name', name)
    switch (name) {
      case PerspectiveCamera.PROP_EYE:
      case PerspectiveCamera.PROP_POSITION: {
        return this.eye.coords
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
    mustBeString('name', name)
    mustBeObject('value', value)
    switch (name) {
      case PerspectiveCamera.PROP_EYE:
      case PerspectiveCamera.PROP_POSITION: {
        this.eye.copyCoordinates(value)
      }
        break;
      default: {
        // TODO
      }
    }
    return this
  }

  /**
   * The aspect ratio (width / height) of the camera viewport.
   *
   * @property aspect
   * @type number
   * @readOnly
   */
  get aspect(): number {
    return this.inner.aspect
  }
  set aspect(aspect: number) {
    this.inner.aspect = aspect
  }

  /**
   * @method setAspect
   * @param aspect {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setAspect(aspect: number): PerspectiveCamera {
    this.inner.aspect = aspect
    return this
  }

  /**
   * The position of the camera, a vector.
   *
   * @property eye
   * @type {Geometric3}
   */
  get eye(): Geometric3 {
    return this.inner.eye
  }
  set eye(eye: Geometric3) {
    this.inner.eye.copyVector(eye)
  }

  /**
   * @method setEye
   * @param eye {VectorE3}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setEye(eye: VectorE3): PerspectiveCamera {
    this.inner.setEye(eye)
    return this
  }

  /**
   * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
   * Measured in radians.
   *
   * @property fov
   * @type {number}
   * @readOnly
   */
  get fov(): number {
    return this.inner.fov
  }
  set fov(unused: number) {
    throw new Error(readOnly('fov').message)
  }
  /**
   * @method setFov
   * @param fov {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setFov(fov: number): PerspectiveCamera {
    mustBeNumber('fov', fov)
    this.inner.fov = fov
    return this
  }

  /**
   * @property look
   * @type Geometric3
   */
  get look(): Geometric3 {
    return this.inner.look
  }
  set look(look: Geometric3) {
    this.inner.setLook(look)
  }

  /**
   * @method setLook
   * @param look {VectorE3}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setLook(look: VectorE3): PerspectiveCamera {
    this.inner.setLook(look)
    return this
  }

  /**
   * The distance to the near plane.
   *
   * @property near
   * @type {number}
   */
  get near(): number {
    return this.inner.near
  }
  set near(near: number) {
    this.inner.near = near
  }

  /**
   * @method setNear
   * @param near {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setNear(near: number): PerspectiveCamera {
    this.inner.setNear(near)
    return this
  }

  /**
   * @property far
   * @type number
   */
  get far(): number {
    return this.inner.far
  }
  set far(far: number) {
    this.inner.far = far
  }

  /**
   * @method setFar
   * @param far {number}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setFar(far: number): PerspectiveCamera {
    this.inner.setFar(far)
    return this
  }

  /**
   * @property up
   * @type Geometric3
   */
  get up(): Geometric3 {
    return this.inner.up
  }
  set up(up: Geometric3) {
    this.inner.up = up
  }

  /**
   * @method setUp
   * @param up {VectorE3}
   * @return {PerspectiveCamera}
   * @chainable
   */
  setUp(up: VectorE3): PerspectiveCamera {
    this.inner.setUp(up)
    return this
  }
}
