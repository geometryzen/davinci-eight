import createPerspective from './createPerspective';
import readOnly from '../i18n/readOnly';
import mustBeObject from '../checks/mustBeObject';
import mustBeGE from '../checks/mustBeGE';
import mustBeLE from '../checks/mustBeLE';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import Perspective from './Perspective';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import R3m from '../math/R3m';
import VectorE3 from '../math/VectorE3';
import Mat4R from '../math/Mat4R'

/**
 * Common abstractions for computing shader uniform variables.
 *
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class PerspectiveCamera
 */
export default class PerspectiveCamera implements Perspective, Facet {
    /**
     * The name of the property that designates the position.
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
     * @optional
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
     * @param [fov = 45 * Math.PI / 180] {number}
     * @param [aspect=1] {number}
     * @param [near=0.1] {number}
     * @param [far=2000] {number}
     * @example
     *   var camera = new EIGHT.PerspectiveCamera()
     *   camera.setAspect(canvas.clientWidth / canvas.clientHeight)
     *   camera.setFov(3.0 * e3)
     */
    constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 2000) {
        mustBeNumber('fov', fov);
        mustBeGE('fov', fov, 0)
        mustBeLE('fov', fov, Math.PI)

        mustBeNumber('aspect', aspect);
        mustBeGE('aspect', aspect, 0)

        mustBeNumber('near', near);
        mustBeGE('near', near, 0)

        mustBeNumber('far', far);
        mustBeGE('far', far, 0)

        this.inner = createPerspective({ fov: fov, aspect: aspect, near: near, far: far });
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor): void {
        this.inner.setNear(this.near);
        this.inner.setFar(this.far);
        this.inner.setUniforms(visitor);
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
                break;
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
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setAspect(aspect: number): PerspectiveCamera {
        this.inner.aspect = aspect;
        return this;
    }

    /**
     * The position of the camera.
     * @property eye
     * @type {R3m}
     * @readOnly
     */
    get eye(): R3m {
        return this.inner.eye;
    }
    set eye(eye: R3m) {
        this.inner.eye.copy(eye);
    }

    /**
     * The position of the camera.
     * @property position
     * @type {R3m}
     * @readOnly
     */
    get position(): R3m {
        return this.inner.eye;
    }
    set position(position: R3m) {
        this.inner.eye.copy(position);
    }

    /**
     * @method setEye
     * @param eye {VectorE3}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
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
    // TODO: Field of view could be specified as an Aspect + Magnitude of a SpinG3m!?
    get fov(): number {
        return this.inner.fov;
    }
    set fov(unused: number) {
        throw new Error(readOnly('fov').message);
    }
    /**
     * @method setFov
     * @param fov {number}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setFov(fov: number): PerspectiveCamera {
        mustBeNumber('fov', fov);
        this.inner.fov = fov;
        return this;
    }

    get look(): R3m {
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
     * @return {PerspectiveCamera} <p><code>this</code> instance, <em>without incrementing the reference count</em>.</p>
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

    get up(): R3m {
        return this.inner.up;
    }
    set up(unused) {
        throw new Error(readOnly('up').message);
    }

    setUp(up: VectorE3): PerspectiveCamera {
        this.inner.setUp(up);
        return this;
    }

    get projectionMatrix(): Mat4R {
        return this.inner.projectionMatrix
    }
    set projectionMatrix(projectionMatrix: Mat4R) {
        throw new Error(readOnly('projectionMatrix').message);
    }

    /**
     * @property viewMatrix
     * @type Mat4R
     * @readOnly
     */
    get viewMatrix(): Mat4R {
        return this.inner.viewMatrix
    }
    set viewMatrix(viewMatrix: Mat4R) {
        this.inner.viewMatrix = viewMatrix
    }
}
