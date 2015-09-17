var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
var Vector3 = require('../math/Vector3');
/**
 * Name used for reference count monitoring and logging.
 */
var LOGGING_NAME_PERSPECTIVE_CAMERA = 'PerspectiveCamera';
/**
 * @module EIGHT
 * @class PerspectiveCamera
 * @implements ICamera
 * @implements UniformData
 */
var PerspectiveCamera = (function () {
    function PerspectiveCamera(fov, aspect, near, far) {
        this.position = new Vector3();
        this._refCount = 1;
        this._uuid = uuid4().generate();
        // FIXME: If cameras do become drawable, then we might want monitoring.
        refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, +1);
    }
    PerspectiveCamera.prototype.addRef = function () {
        this._refCount++;
        refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, +1);
        return this._refCount;
    };
    PerspectiveCamera.prototype.accept = function (visitor) {
        console.warn("PerspectiveCamera is ignoring visitor. How impolite!");
    };
    PerspectiveCamera.prototype.contextFree = function () {
    };
    PerspectiveCamera.prototype.contextGain = function (manager) {
    };
    PerspectiveCamera.prototype.contextLoss = function () {
    };
    PerspectiveCamera.prototype.draw = function () {
        // Do nothing.
    };
    PerspectiveCamera.prototype.release = function () {
        this._refCount--;
        refChange(this._uuid, LOGGING_NAME_PERSPECTIVE_CAMERA, -1);
        return this._refCount;
    };
    return PerspectiveCamera;
})();
module.exports = PerspectiveCamera;
