var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../cameras/createPerspective', '../i18n/readOnly', '../checks/mustBeObject', '../checks/mustBeNumber', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, createPerspective, readOnly, mustBeObject, mustBeNumber, mustBeString, Shareable) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var CLASS_NAME = 'PerspectiveCamera';
    /**
     * @class PerspectiveCamera
     */
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        /**
         * <p>
         *
         * </p>
         * @class PerspectiveCamera
         * @constructor
         * @param [fov = 75 * Math.PI / 180] {number}
         * @param [aspect=1] {number}
         * @param [near=0.1] {number}
         * @param [far=2000] {number}
         * @example
         *   var camera = new EIGHT.PerspectiveCamera()
         *   camera.setAspect(canvas.clientWidth / canvas.clientHeight)
         *   camera.setFov(3.0 * e3)
         */
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 75 * Math.PI / 180; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 2000; }
            _super.call(this, 'PerspectiveCamera');
            mustBeNumber('fov', fov);
            mustBeNumber('aspect', aspect);
            mustBeNumber('near', near);
            mustBeNumber('far', far);
            this.inner = createPerspective({ fov: fov, aspect: aspect, near: near, far: far });
        }
        PerspectiveCamera.prototype.destructor = function () {
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         * @return {void}
         */
        PerspectiveCamera.prototype.setUniforms = function (visitor, canvasId) {
            this.inner.setNear(this.near);
            this.inner.setFar(this.far);
            this.inner.setUniforms(visitor, canvasId);
        };
        PerspectiveCamera.prototype.contextFree = function () {
        };
        PerspectiveCamera.prototype.contextGain = function (manager) {
        };
        PerspectiveCamera.prototype.contextLost = function () {
        };
        PerspectiveCamera.prototype.draw = function (canvasId) {
            console.warn(CLASS_NAME + ".draw(" + canvasId + ")");
            // Do nothing.
        };
        PerspectiveCamera.prototype.getProperty = function (name) {
            mustBeString('name', name);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION: {
                    return this.eye.coords;
                    break;
                }
                default: {
                }
            }
        };
        PerspectiveCamera.prototype.setProperty = function (name, value) {
            mustBeString('name', name);
            mustBeObject('value', value);
            switch (name) {
                case PerspectiveCamera.PROP_EYE:
                case PerspectiveCamera.PROP_POSITION: {
                    this.eye.copyCoordinates(value);
                    break;
                }
                default: {
                }
            }
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
            /**
             * The aspect ratio (width / height) of the camera viewport.
             * @property aspect
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this.inner.aspect;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAspect
         * @param aspect {number}
         * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
         * @chainable
         */
        PerspectiveCamera.prototype.setAspect = function (aspect) {
            this.inner.aspect = aspect;
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "eye", {
            /**
             * The position of the camera.
             * @property eye
             * @type {R3}
             * @readOnly
             */
            get: function () {
                return this.inner.eye;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setEye
         * @param eye {VectorE3}
         * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
         * @chainable
         */
        PerspectiveCamera.prototype.setEye = function (eye) {
            this.inner.setEye(eye);
            return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
            /**
             * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
             * Measured in radians.
             * @property fov
             * @type {number}
             * @readOnly
             */
            // TODO: Field of view could be specified as an Aspect + Magnitude of a SpinG3!?
            get: function () {
                return this.inner.fov;
            },
            set: function (unused) {
                throw new Error(readOnly('fov').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setFov
         * @param fov {number}
         * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
         * @chainable
         */
        PerspectiveCamera.prototype.setFov = function (fov) {
            mustBeNumber('fov', fov);
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
            /**
             * The distance to the near plane.
             * @property near
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this.inner.near;
            },
            set: function (unused) {
                throw new Error(readOnly('near').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setNear
         * @param near {number}
         * @return {PerspectiveCamera} <p><code>this</code> instance, <em>without incrementing the reference count</em>.</p>
         * @chainable
         */
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
                throw new Error(readOnly('up').message);
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setUp = function (up) {
            this.inner.setUp(up);
            return this;
        };
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        PerspectiveCamera.PROP_POSITION = 'X';
        PerspectiveCamera.PROP_EYE = 'eye';
        return PerspectiveCamera;
    })(Shareable);
    return PerspectiveCamera;
});
