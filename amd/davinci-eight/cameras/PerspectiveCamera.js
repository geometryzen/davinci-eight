var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../cameras/createPerspective', '../i18n/readOnly', '../checks/mustBeObject', '../checks/mustBeNumber', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, createPerspective_1, readOnly_1, mustBeObject_1, mustBeNumber_1, mustBeString_1, Shareable_1) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 45 * Math.PI / 180; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 2000; }
            _super.call(this, 'PerspectiveCamera');
            mustBeNumber_1.default('fov', fov);
            mustBeNumber_1.default('aspect', aspect);
            mustBeNumber_1.default('near', near);
            mustBeNumber_1.default('far', far);
            this.inner = createPerspective_1.default({ fov: fov, aspect: aspect, near: near, far: far });
        }
        PerspectiveCamera.prototype.destructor = function () {
        };
        PerspectiveCamera.prototype.setUniforms = function (visitor, canvasId) {
            this.inner.setNear(this.near);
            this.inner.setFar(this.far);
            this.inner.setUniforms(visitor, canvasId);
        };
        PerspectiveCamera.prototype.contextFree = function (canvasId) {
        };
        PerspectiveCamera.prototype.contextGain = function (manager) {
        };
        PerspectiveCamera.prototype.contextLost = function (canvasId) {
        };
        PerspectiveCamera.prototype.draw = function (canvasId) {
        };
        PerspectiveCamera.prototype.getProperty = function (name) {
            mustBeString_1.default('name', name);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION:
                    {
                        return this.eye.coords;
                    }
                    break;
                default: {
                }
            }
        };
        PerspectiveCamera.prototype.setProperty = function (name, value) {
            mustBeString_1.default('name', name);
            mustBeObject_1.default('value', value);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION:
                    {
                        this.eye.copyCoordinates(value);
                    }
                    break;
                default: {
                }
            }
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
            get: function () {
                return this.inner.aspect;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setAspect = function (aspect) {
            this.inner.aspect = aspect;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "eye", {
            get: function () {
                return this.inner.eye;
            },
            set: function (eye) {
                this.inner.eye.copy(eye);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setEye = function (eye) {
            this.inner.setEye(eye);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
            get: function () {
                return this.inner.fov;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('fov').message);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setFov = function (fov) {
            mustBeNumber_1.default('fov', fov);
            this.inner.fov = fov;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "look", {
            get: function () {
                return this.inner.look;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setLook = function (look) {
            this.inner.setLook(look);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "near", {
            get: function () {
                return this.inner.near;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('near').message);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setNear = function (near) {
            this.inner.setNear(near);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "far", {
            get: function () {
                return this.inner.far;
            },
            set: function (far) {
                this.inner.far = far;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setFar = function (far) {
            this.inner.setFar(far);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "up", {
            get: function () {
                return this.inner.up;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('up').message);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setUp = function (up) {
            this.inner.setUp(up);
            return this;
        };
        PerspectiveCamera.PROP_POSITION = 'X';
        PerspectiveCamera.PROP_EYE = 'eye';
        return PerspectiveCamera;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PerspectiveCamera;
});
