import { Geometric3 } from '../math/Geometric3';
import { PerspectiveTransform } from './PerspectiveTransform';
import { ViewTransform } from './ViewTransform';
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
var PerspectiveCamera = /** @class */ (function () {
    /**
     *
     * @param fov The field of view.
     * @param aspect The aspect is the ratio width / height.
     * @param near The distance of the near plane from the camera.
     * @param far The distance of the far plane from the camera.
     */
    function PerspectiveCamera(fov, aspect, near, far) {
        if (fov === void 0) { fov = 45 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 1000; }
        this.P = new PerspectiveTransform(fov, aspect, near, far);
        this.V = new ViewTransform();
    }
    /**
     * Converts from image cube coordinates to world coordinates.
     * @param imageX The x-coordinate in the image cube. -1 <= x <= +1.
     * @param imageY The y-coordinate in the image cube. -1 <= y <= +1.
     * @param imageZ The z-coordinate in the image cube. -1 <= z <= +1.
     */
    PerspectiveCamera.prototype.imageToWorldCoords = function (imageX, imageY, imageZ) {
        var cameraCoords = this.P.imageToCameraCoords(imageX, imageY, imageZ);
        return Geometric3.fromVector(this.V.cameraToWorldCoords(cameraCoords));
    };
    /**
     *
     */
    PerspectiveCamera.prototype.setUniforms = function (visitor) {
        this.V.setUniforms(visitor);
        this.P.setUniforms(visitor);
    };
    Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
        /**
         * The aspect ratio (width / height) of the camera viewport.
         */
        get: function () {
            return this.P.aspect;
        },
        set: function (aspect) {
            this.P.aspect = aspect;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "eye", {
        /**
         * The position of the camera, a vector.
         */
        get: function () {
            return this.V.eye;
        },
        set: function (eye) {
            this.V.eye.copyVector(eye);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "fov", {
        /**
         * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
         * Measured in radians.
         */
        get: function () {
            return this.P.fov;
        },
        set: function (value) {
            this.P.fov = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "look", {
        /**
         * The point that is being looked at.
         */
        get: function () {
            return this.V.look;
        },
        set: function (look) {
            this.V.look.copyVector(look);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "near", {
        /**
         * The distance to the near plane.
         */
        get: function () {
            return this.P.near;
        },
        set: function (near) {
            this.P.near = near;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "far", {
        /**
         * The distance to the far plane.
         */
        get: function () {
            return this.P.far;
        },
        set: function (far) {
            this.P.far = far;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "up", {
        /**
         * The approximate up direction.
         */
        get: function () {
            return this.V.up;
        },
        set: function (up) {
            this.V.up.copyVector(up);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "projectionMatrixUniformName", {
        /**
         * The name of the uniform mat4 variable in the vertex shader that receives the projection matrix value.
         * The default name is `uProjection`.
         */
        get: function () {
            return this.P.projectionMatrixUniformName;
        },
        set: function (name) {
            this.P.projectionMatrixUniformName = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "projectionMatrix", {
        get: function () {
            return this.P.matrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "viewMatrixUniformName", {
        /**
         * The name of the uniform mat4 variable in the vertex shader that receives the view matrix value.
         * The default name is `uView`.
         */
        get: function () {
            return this.V.viewMatrixUniformName;
        },
        set: function (name) {
            this.V.viewMatrixUniformName = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "viewMatrix", {
        get: function () {
            return this.V.matrix;
        },
        enumerable: false,
        configurable: true
    });
    return PerspectiveCamera;
}());
export { PerspectiveCamera };
