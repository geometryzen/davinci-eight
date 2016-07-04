import createPerspective from './createPerspective';
import {Geometric3} from '../math/Geometric3';
import readOnly from '../i18n/readOnly';
import mustBeObject from '../checks/mustBeObject';
import mustBeGE from '../checks/mustBeGE';
import mustBeLE from '../checks/mustBeLE';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeString from '../checks/mustBeString';
import Perspective from './Perspective';
import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';
import VectorE3 from '../math/VectorE3';
import Matrix4 from '../math/Matrix4';

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
 *     const ambients: Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.aspect = canvas.clientWidth / canvas.clientHeight
 *     camera.eye = Geometric3.copyVector(R3.e3)
 *     ambients.push(camera)
 *
 *     scene.draw(ambients)
 *
 * <p>The camera is initially positioned at <b>e</b><sub>3</sub>.</p>
 */
export class PerspectiveCamera implements Perspective, Facet {

    /**
     * The name of the property that designates the position.
     */
    private static PROP_POSITION = 'X';

    /**
     *
     */
    private static PROP_EYE = 'eye';

    /**
     *
     */
    private inner: Perspective;

    /**
     *
     * @param fov The field of view.
     * @param aspect The aspect is the ratio width / height.
     * @param near The distance of the near plane from the camera.
     * @param far The distance of the far plane from the camera. 
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
     * @param visitor
     */
    setUniforms(visitor: FacetVisitor): void {
        // Synchronize the near and far properties before delegating.
        this.inner.setNear(this.near)
        this.inner.setFar(this.far)
        this.inner.setUniforms(visitor)
    }

    /**
     * @param name
     * @returns
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
     * @param name
     * @param value
     * @returns
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
     */
    get aspect(): number {
        return this.inner.aspect
    }
    set aspect(aspect: number) {
        this.inner.aspect = aspect
    }

    /**
     * @param aspect
     * @returns
     */
    setAspect(aspect: number): PerspectiveCamera {
        this.inner.aspect = aspect
        return this
    }

    /**
     * The position of the camera, a vector.
     */
    get eye(): Geometric3 {
        return this.inner.eye
    }
    set eye(eye: Geometric3) {
        this.inner.eye.copyVector(eye)
    }

    /**
     * @param eye
     * @returns
     */
    setEye(eye: VectorE3): PerspectiveCamera {
        this.inner.setEye(eye)
        return this
    }

    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     */
    get fov(): number {
        return this.inner.fov
    }
    set fov(unused: number) {
        throw new Error(readOnly('fov').message)
    }

    /**
     * @param fov
     * @returns
     */
    setFov(fov: number): PerspectiveCamera {
        mustBeNumber('fov', fov)
        this.inner.fov = fov
        return this
    }

    /**
     *
     */
    get look(): Geometric3 {
        return this.inner.look
    }
    set look(look: Geometric3) {
        this.inner.setLook(look)
    }

    /**
     * @param look
     * @returns
     */
    setLook(look: VectorE3): PerspectiveCamera {
        this.inner.setLook(look)
        return this
    }

    /**
     * The distance to the near plane.
     */
    get near(): number {
        return this.inner.near
    }
    set near(near: number) {
        this.inner.near = near
    }

    /**
     * @param near
     * @returns
     */
    setNear(near: number): PerspectiveCamera {
        this.inner.setNear(near)
        return this
    }

    /**
     *
     */
    get far(): number {
        return this.inner.far
    }
    set far(far: number) {
        this.inner.far = far
    }

    /**
     * @param far
     * @returns
     */
    setFar(far: number): PerspectiveCamera {
        this.inner.setFar(far)
        return this
    }

    /**
     *
     */
    get up(): Geometric3 {
        return this.inner.up
    }
    set up(up: Geometric3) {
        this.inner.up = up
    }

    /**
     * @param up
     * @returns
     */
    setUp(up: VectorE3): PerspectiveCamera {
        this.inner.setUp(up)
        return this
    }

    get projectionMatrix(): Matrix4 {
        return this.inner.projectionMatrix;
    }

    set projectionMatrix(projectionMatrix: Matrix4) {
        this.inner.projectionMatrix = projectionMatrix;
    }

    updateProjectionMatrix(): void {
        this.inner.updateProjectionMatrix();
    }

    updateViewMatrix(): void {
        this.inner.updateViewMatrix();
    }

    get viewMatrix(): Matrix4 {
        return this.inner.viewMatrix;
    }

    set viewMatrix(viewMatrix: Matrix4) {
        this.inner.viewMatrix = viewMatrix;
    }
}
