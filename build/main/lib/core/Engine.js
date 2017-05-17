"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var checkEnums_1 = require("./checkEnums");
var ClearBufferMask_1 = require("./ClearBufferMask");
var EIGHTLogger_1 = require("../commands/EIGHTLogger");
var initWebGL_1 = require("./initWebGL");
var isDefined_1 = require("../checks/isDefined");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeLE_1 = require("../checks/mustBeLE");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeString_1 = require("../checks/mustBeString");
var ShareableArray_1 = require("../collections/ShareableArray");
var ShareableBase_1 = require("./ShareableBase");
var R3_1 = require("../math/R3");
var VersionLogger_1 = require("../commands/VersionLogger");
var WebGLClearColor_1 = require("../commands/WebGLClearColor");
var WebGLEnable_1 = require("../commands/WebGLEnable");
var WebGLDisable_1 = require("../commands/WebGLDisable");
/**
 * A wrapper around an HTMLCanvasElement providing access to the WebGLRenderingContext
 * and notifications of context loss and restore. An instance of the Engine will usually
 * be a required parameter for any consumer of WebGL resources.
 *
 *
 *     export const e1 = EIGHT.Geometric3.e1;
 *     export const e2 = EIGHT.Geometric3.e2;
 *     export const e3 = EIGHT.Geometric3.e3;
 *
 *     const engine = new EIGHT.Engine('canvas3D')
 *       .size(500, 500)
 *       .clearColor(0.1, 0.1, 0.1, 1.0)
 *       .enable(EIGHT.Capability.DEPTH_TEST)
 *
 *     const scene = new EIGHT.Scene(engine)
 *
 *     const ambients: EIGHT.Facet[] = []
 *
 *     const camera = new EIGHT.PerspectiveCamera()
 *     camera.eye = e2 + 3 * e3
 *     ambients.push(camera)
 *
 *     const dirLight = new EIGHT.DirectionalLight()
 *     ambients.push(dirLight)
 *
 *     const trackball = new EIGHT.TrackballControls(camera)
 *     trackball.subscribe(engine.canvas)
 *
 *     const box = new EIGHT.Box(engine)
 *     box.color = EIGHT.Color.green
 *     scene.add(box)
 *
 *     const animate = function(timestamp: number) {
 *       engine.clear()
 *
 *       trackball.update()
 *
 *       dirLight.direction = camera.look - camera.eye
 *
 *       box.attitude.rotorFromAxisAngle(e2, timestamp * 0.001)
 *
 *       scene.render(ambients)
 *
 *       requestAnimationFrame(animate)
 *     }
 *
 *     requestAnimationFrame(animate)
 */
var Engine = (function (_super) {
    tslib_1.__extends(Engine, _super);
    /**
     * @param canvas
     * @param attributes Allows the context to be configured.
     * @param doc The document object model that contains the canvas identifier.
     */
    function Engine(canvas, attributes, doc) {
        if (attributes === void 0) { attributes = {}; }
        if (doc === void 0) { doc = window.document; }
        var _this = _super.call(this) || this;
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        _this._users = [];
        /**
         * Actions that are executed when a WebGLRenderingContext is gained.
         */
        _this._commands = new ShareableArray_1.ShareableArray([]);
        /**
         * The cache of Geometry.
         */
        _this.geometries = {};
        /**
         * The cache of Material.
         */
        _this.materials = {};
        _this.setLoggingName('Engine');
        _this._attributes = attributes;
        if (attributes.eightLogging) {
            _this._commands.pushWeakRef(new EIGHTLogger_1.EIGHTLogger());
        }
        if (attributes.webglLogging) {
            _this._commands.pushWeakRef(new VersionLogger_1.VersionLogger(_this));
        }
        _this._webGLContextLost = function (event) {
            if (isDefined_1.isDefined(_this._gl)) {
                event.preventDefault();
                _this._gl = void 0;
                _this._users.forEach(function (user) {
                    user.contextLost();
                });
            }
        };
        _this._webGLContextRestored = function (event) {
            if (isDefined_1.isDefined(_this._gl)) {
                event.preventDefault();
                _this._gl = initWebGL_1.initWebGL(_this._gl.canvas, attributes);
                _this._users.forEach(function (user) {
                    user.contextGain();
                });
            }
        };
        if (canvas) {
            _this.start(canvas, doc);
        }
        return _this;
    }
    /**
     *
     */
    Engine.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('Engine');
        this._commands = new ShareableArray_1.ShareableArray([]);
    };
    /**
     *
     */
    Engine.prototype.destructor = function (levelUp) {
        this.stop();
        while (this._users.length > 0) {
            this._users.pop();
        }
        this._commands.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    Engine.prototype.addContextListener = function (user) {
        mustBeNonNullObject_1.mustBeNonNullObject('user', user);
        var index = this._users.indexOf(user);
        if (index < 0) {
            this._users.push(user);
        }
        else {
            console.warn("user already exists for addContextListener");
        }
    };
    Object.defineProperty(Engine.prototype, "canvas", {
        /**
         * The canvas element associated with the WebGLRenderingContext.
         */
        get: function () {
            if (this._gl) {
                return this._gl.canvas;
            }
            else {
                return void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "drawingBufferHeight", {
        get: function () {
            if (this._gl) {
                return this._gl.drawingBufferHeight;
            }
            else {
                return void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "drawingBufferWidth", {
        get: function () {
            if (this._gl) {
                return this._gl.drawingBufferWidth;
            }
            else {
                return void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.blendFunc = function (sfactor, dfactor) {
        var gl = this._gl;
        if (gl) {
            gl.blendFunc(sfactor, dfactor);
        }
        return this;
    };
    /**
     * <p>
     * Sets the graphics buffers to values preselected by clearColor, clearDepth or clearStencil.
     * </p>
     */
    Engine.prototype.clear = function (mask) {
        if (mask === void 0) { mask = ClearBufferMask_1.ClearBufferMask.COLOR_BUFFER_BIT | ClearBufferMask_1.ClearBufferMask.DEPTH_BUFFER_BIT; }
        var gl = this._gl;
        if (gl) {
            gl.clear(mask);
        }
        return this;
    };
    /**
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     */
    Engine.prototype.clearColor = function (red, green, blue, alpha) {
        this._commands.pushWeakRef(new WebGLClearColor_1.WebGLClearColor(this, red, green, blue, alpha));
        var gl = this._gl;
        if (gl) {
            gl.clearColor(red, green, blue, alpha);
        }
        return this;
    };
    /**
     * Specifies the clear value for the depth buffer.
     * This specifies what depth value to use when calling the clear() method.
     * The value is clamped between 0 and 1.
     *
     * @param depth Specifies the depth value used when the depth buffer is cleared.
     * The default value is 1.
     */
    Engine.prototype.clearDepth = function (depth) {
        var gl = this._gl;
        if (gl) {
            gl.clearDepth(depth);
        }
        return this;
    };
    /**
     * @param s Specifies the index used when the stencil buffer is cleared.
     * The default value is 0.
     */
    Engine.prototype.clearStencil = function (s) {
        var gl = this._gl;
        if (gl) {
            gl.clearStencil(s);
        }
        return this;
    };
    Engine.prototype.depthFunc = function (func) {
        var gl = this._gl;
        if (gl) {
            gl.depthFunc(func);
        }
        return this;
    };
    Engine.prototype.depthMask = function (flag) {
        var gl = this._gl;
        if (gl) {
            gl.depthMask(flag);
        }
        return this;
    };
    /**
     * Disables the specified WebGL capability.
     */
    Engine.prototype.disable = function (capability) {
        this._commands.pushWeakRef(new WebGLDisable_1.WebGLDisable(this, capability));
        if (this._gl) {
            this._gl.disable(capability);
        }
        return this;
    };
    /**
     * Enables the specified WebGL capability.
     */
    Engine.prototype.enable = function (capability) {
        this._commands.pushWeakRef(new WebGLEnable_1.WebGLEnable(this, capability));
        if (this._gl) {
            this._gl.enable(capability);
        }
        return this;
    };
    Object.defineProperty(Engine.prototype, "gl", {
        /**
         * The underlying WebGL rendering context.
         */
        get: function () {
            if (this._gl) {
                return this._gl;
            }
            else {
                return void 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Engine.prototype.readPixels = function (x, y, width, height, format, type, pixels) {
        if (this._gl) {
            this._gl.readPixels(x, y, width, height, format, type, pixels);
        }
    };
    /**
     * @param user
     */
    Engine.prototype.removeContextListener = function (user) {
        mustBeNonNullObject_1.mustBeNonNullObject('user', user);
        var index = this._users.indexOf(user);
        if (index >= 0) {
            this._users.splice(index, 1);
        }
    };
    /**
     * A convenience method for setting the width and height properties of the
     * underlying canvas and for setting the viewport to the drawing buffer height and width.
     */
    Engine.prototype.size = function (width, height) {
        this.canvas.width = mustBeNumber_1.mustBeNumber('width', width);
        this.canvas.height = mustBeNumber_1.mustBeNumber('height', height);
        return this.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    };
    /**
     * The viewport width and height are clamped to a range that is
     * implementation dependent.
     *
     * @returns e.g. Int32Array[16384, 16384]
     */
    Engine.prototype.getMaxViewportDims = function () {
        var gl = this._gl;
        if (gl) {
            return gl.getParameter(gl.MAX_VIEWPORT_DIMS);
        }
        else {
            return void 0;
        }
    };
    /**
     * Returns the current viewport settings.
     *
     * @returns e.g. Int32Array[x, y, width, height]
     */
    Engine.prototype.getViewport = function () {
        var gl = this._gl;
        if (gl) {
            return gl.getParameter(gl.VIEWPORT);
        }
        else {
            return void 0;
        }
    };
    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    Engine.prototype.viewport = function (x, y, width, height) {
        var gl = this._gl;
        if (gl) {
            gl.viewport(x, y, width, height);
        }
        return this;
    };
    /**
     * Initializes the <code>WebGLRenderingContext</code> for the specified <code>HTMLCanvasElement</code>.
     *
     * @param canvas The HTML canvas element or canvas element identifier.
     * @param doc The document object model that contains the canvas identifier.
     */
    Engine.prototype.start = function (canvas, doc) {
        if (doc === void 0) { doc = window.document; }
        if (typeof canvas === 'string') {
            var canvasElement = doc.getElementById(canvas);
            if (canvasElement) {
                return this.start(canvasElement, doc);
            }
            else {
                throw new Error("canvas argument must be a canvas element id or an HTMLCanvasElement.");
            }
        }
        else if (canvas instanceof HTMLCanvasElement) {
            if (isDefined_1.isDefined(this._gl)) {
                // We'll just be idempotent and ignore the call because we've already been started.
                // To use the canvas might conflict with one we have dynamically created.
                console.warn(this.getLoggingName() + " Ignoring start() because already started.");
                return this;
            }
            else {
                this._gl = checkEnums_1.checkEnums(initWebGL_1.initWebGL(canvas, this._attributes));
                this.emitStartEvent();
                canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
            }
            return this;
        }
        else {
            if (isDefined_1.isDefined(canvas)) {
                this._gl = checkEnums_1.checkEnums(canvas);
            }
            return this;
        }
    };
    /**
     *
     */
    Engine.prototype.stop = function () {
        if (isDefined_1.isDefined(this._gl)) {
            this._gl.canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false);
            this._gl.canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false);
            if (this._gl) {
                this.emitStopEvent();
                this._gl = void 0;
            }
        }
        return this;
    };
    Engine.prototype.emitStartEvent = function () {
        var _this = this;
        this._users.forEach(function (user) {
            _this.emitContextGain(user);
        });
        this._commands.forEach(function (command) {
            _this.emitContextGain(command);
        });
    };
    Engine.prototype.emitContextGain = function (consumer) {
        if (this._gl.isContextLost()) {
            consumer.contextLost();
        }
        else {
            consumer.contextGain();
        }
    };
    Engine.prototype.emitStopEvent = function () {
        var _this = this;
        this._users.forEach(function (user) {
            _this.emitContextFree(user);
        });
        this._commands.forEach(function (command) {
            _this.emitContextFree(command);
        });
    };
    Engine.prototype.emitContextFree = function (consumer) {
        if (this._gl.isContextLost()) {
            consumer.contextLost();
        }
        else {
            consumer.contextFree();
        }
    };
    /**
     * @param consumer
     */
    Engine.prototype.synchronize = function (consumer) {
        if (this._gl) {
            this.emitContextGain(consumer);
        }
        else {
            // FIXME: Broken symmetry?
        }
        return this;
    };
    /**
     *
     */
    Engine.prototype.getCacheGeometry = function (geometryKey) {
        mustBeNonNullObject_1.mustBeNonNullObject('geometryKey', geometryKey);
        mustBeString_1.mustBeString('geometryKey.kind', geometryKey.kind);
        var key = JSON.stringify(geometryKey);
        var geometry = this.geometries[key];
        if (geometry && geometry.addRef) {
            geometry.addRef();
        }
        return geometry;
    };
    /**
     *
     */
    Engine.prototype.putCacheGeometry = function (geometryKey, geometry) {
        mustBeNonNullObject_1.mustBeNonNullObject('geometryKey', geometryKey);
        mustBeNonNullObject_1.mustBeNonNullObject('geometry', geometry);
        mustBeString_1.mustBeString('geometryKey.kind', geometryKey.kind);
        var key = JSON.stringify(geometryKey);
        this.geometries[key] = geometry;
    };
    /**
     *
     */
    Engine.prototype.getCacheMaterial = function (materialKey) {
        mustBeNonNullObject_1.mustBeNonNullObject('materialKey', materialKey);
        mustBeString_1.mustBeString('materialKey.kind', materialKey.kind);
        var key = JSON.stringify(materialKey);
        var material = this.materials[key];
        if (material && material.addRef) {
            material.addRef();
        }
        return material;
    };
    /**
     *
     */
    Engine.prototype.putCacheMaterial = function (materialKey, material) {
        mustBeNonNullObject_1.mustBeNonNullObject('materialKey', materialKey);
        mustBeNonNullObject_1.mustBeNonNullObject('material', material);
        mustBeString_1.mustBeString('materialKey.kind', materialKey.kind);
        var key = JSON.stringify(materialKey);
        this.materials[key] = material;
    };
    /**
     * Computes the coordinates of a point in the image cube corresponding to device coordinates.
     * @param deviceX The x-coordinate of the device event.
     * @param deviceY The y-coordinate of the device event.
     * @param imageZ The optional value to use as the resulting depth coordinate.
     */
    Engine.prototype.deviceToImageCoords = function (deviceX, deviceY, imageZ) {
        if (imageZ === void 0) { imageZ = 0; }
        mustBeNumber_1.mustBeNumber('deviceX', deviceX);
        mustBeNumber_1.mustBeNumber('deviceY', deviceY);
        mustBeNumber_1.mustBeNumber('imageZ', imageZ);
        mustBeGE_1.mustBeGE('imageZ', imageZ, -1);
        mustBeLE_1.mustBeLE('imageZ', imageZ, +1);
        var imageX = ((2 * deviceX) / this.canvas.width) - 1;
        var imageY = 1 - (2 * deviceY) / this.canvas.height;
        return R3_1.vectorFromCoords(imageX, imageY, imageZ);
    };
    return Engine;
}(ShareableBase_1.ShareableBase));
exports.Engine = Engine;
