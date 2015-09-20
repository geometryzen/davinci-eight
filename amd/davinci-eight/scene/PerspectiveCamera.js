define(["require", "exports", '../cameras/createPerspective', '../utils/refChange', '../utils/uuid4', '../math/Vector3'], function (require, exports, createPerspective, refChange, uuid4, Vector3) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var CLASS_NAME = 'PerspectiveCamera';
    /**
     * @module EIGHT
     * @class PerspectiveCamera
     * @implements ICamera
     * @implements UniformData
     */
    var PerspectiveCamera = (function () {
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 50 * Math.PI / 180; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 2000; }
            this.position = new Vector3();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this.inner = createPerspective();
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;
            // FIXME: If cameras do become drawable, then we might want monitoring.
            refChange(this._uuid, CLASS_NAME, +1);
        }
        PerspectiveCamera.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, CLASS_NAME, +1);
            return this._refCount;
        };
        PerspectiveCamera.prototype.setUniforms = function (visitor, canvasId) {
            this.inner.setFov(this.fov);
            this.inner.setAspect(this.aspect);
            this.inner.setNear(this.near);
            this.inner.setFar(this.far);
            this.inner.setEye(this.position);
            this.inner.setUniforms(visitor, canvasId);
        };
        PerspectiveCamera.prototype.contextFree = function () {
        };
        PerspectiveCamera.prototype.contextGain = function (manager) {
        };
        PerspectiveCamera.prototype.contextLoss = function () {
        };
        PerspectiveCamera.prototype.draw = function (canvasId) {
            console.log(CLASS_NAME + ".draw(" + canvasId + ")");
            // Do nothing.
        };
        PerspectiveCamera.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, CLASS_NAME, -1);
            if (this._refCount === 0) {
                return 0;
            }
            else {
            }
            return this._refCount;
        };
        return PerspectiveCamera;
    })();
    return PerspectiveCamera;
});
