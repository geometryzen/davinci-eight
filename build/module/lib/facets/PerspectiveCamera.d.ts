import { Geometric3 } from '../math/Geometric3';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
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
export declare class PerspectiveCamera implements Facet {
    /**
     *
     */
    private P;
    /**
     *
     */
    private V;
    /**
     *
     * @param fov The field of view.
     * @param aspect The aspect is the ratio width / height.
     * @param near The distance of the near plane from the camera.
     * @param far The distance of the far plane from the camera.
     */
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    /**
     * Converts from image cube coordinates to world coordinates.
     * @param imageX The x-coordinate in the image cube. -1 <= x <= +1.
     * @param imageY The y-coordinate in the image cube. -1 <= y <= +1.
     * @param imageZ The z-coordinate in the image cube. -1 <= z <= +1.
     */
    imageToWorldCoords(imageX: number, imageY: number, imageZ: number): Geometric3;
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
    /**
     * The aspect ratio (width / height) of the camera viewport.
     */
    aspect: number;
    /**
     * The position of the camera, a vector.
     */
    eye: Geometric3;
    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     */
    fov: number;
    /**
     * The point that is being looked at.
     */
    look: Geometric3;
    /**
     * The distance to the near plane.
     */
    near: number;
    /**
     * The distance to the far plane.
     */
    far: number;
    /**
     * The approximate up direction.
     */
    up: Geometric3;
    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the projection matrix value.
     * The default name is `uProjection`.
     */
    projectionMatrixUniformName: string;
    readonly projectionMatrix: Matrix4;
    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the view matrix value.
     * The default name is `uView`.
     */
    viewMatrixUniformName: string;
    readonly viewMatrix: Matrix4;
}
