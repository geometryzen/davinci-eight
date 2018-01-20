import { Geometric3 } from '../math/Geometric3';
import { PerspectiveTransform } from './PerspectiveTransform';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { ViewTransform } from './ViewTransform';
import { Matrix4 } from '../math/Matrix4';

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
export class PerspectiveCamera implements Facet {
    /**
     *
     */
    private P: PerspectiveTransform;
    /**
     * 
     */
    private V: ViewTransform;

    /**
     *
     * @param fov The field of view.
     * @param aspect The aspect is the ratio width / height.
     * @param near The distance of the near plane from the camera.
     * @param far The distance of the far plane from the camera. 
     */
    constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 1000) {
        this.P = new PerspectiveTransform(fov, aspect, near, far);
        this.V = new ViewTransform();
    }

    /**
     * Converts from image cube coordinates to world coordinates.
     * @param imageX The x-coordinate in the image cube. -1 <= x <= +1.
     * @param imageY The y-coordinate in the image cube. -1 <= y <= +1.
     * @param imageZ The z-coordinate in the image cube. -1 <= z <= +1.
     */
    imageToWorldCoords(imageX: number, imageY: number, imageZ: number): Geometric3 {
        const cameraCoords = this.P.imageToCameraCoords(imageX, imageY, imageZ);
        return Geometric3.fromVector(this.V.cameraToWorldCoords(cameraCoords));
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        this.V.setUniforms(visitor);
        this.P.setUniforms(visitor);
    }

    /**
     * The aspect ratio (width / height) of the camera viewport.
     */
    get aspect(): number {
        return this.P.aspect;
    }
    set aspect(aspect: number) {
        this.P.aspect = aspect;
    }

    /**
     * The position of the camera, a vector.
     */
    get eye(): Geometric3 {
        return this.V.eye;
    }
    set eye(eye: Geometric3) {
        this.V.eye.copyVector(eye);
    }

    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     */
    get fov(): number {
        return this.P.fov;
    }
    set fov(value: number) {
        this.P.fov = value;
    }

    /**
     * The point that is being looked at.
     */
    get look(): Geometric3 {
        return this.V.look;
    }
    set look(look: Geometric3) {
        this.V.look.copyVector(look);
    }

    /**
     * The distance to the near plane.
     */
    get near(): number {
        return this.P.near;
    }
    set near(near: number) {
        this.P.near = near;
    }

    /**
     * The distance to the far plane.
     */
    get far(): number {
        return this.P.far;
    }
    set far(far: number) {
        this.P.far = far;
    }

    /**
     * The approximate up direction.
     */
    get up(): Geometric3 {
        return this.V.up;
    }
    set up(up: Geometric3) {
        this.V.up.copyVector(up);
    }

    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the projection matrix value.
     * The default name is `uProjection`.
     */
    get projectionMatrixUniformName(): string {
        return this.P.projectionMatrixUniformName;
    }
    set projectionMatrixUniformName(name: string) {
        this.P.projectionMatrixUniformName = name;
    }

    get projectionMatrix(): Matrix4 {
        return this.P.matrix
    }

    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the view matrix value.
     * The default name is `uView`.
     */
    get viewMatrixUniformName(): string {
        return this.V.viewMatrixUniformName;
    }
    set viewMatrixUniformName(name: string) {
        this.V.viewMatrixUniformName = name;
    }

    get viewMatrix(): Matrix4 {
        return this.V.matrix
    }
}
