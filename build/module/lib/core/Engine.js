import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLE } from '../checks/mustBeLE';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeWebGLContextId } from '../checks/mustBeWebGLContextId';
import { ShareableArray } from '../collections/ShareableArray';
import { EIGHTLogger } from '../commands/EIGHTLogger';
import { VersionLogger } from '../commands/VersionLogger';
import { WebGLClearColor } from '../commands/WebGLClearColor';
import { WebGLDisable } from '../commands/WebGLDisable';
import { WebGLEnable } from '../commands/WebGLEnable';
import { vectorFromCoords } from '../math/R3';
import { checkEnums } from './checkEnums';
import { ClearBufferMask } from './ClearBufferMask';
import { initWebGL } from './initWebGL';
import { ShareableBase } from './ShareableBase';
/**
 * @hidden
 */
function getWindowDocument(window) {
    if (window) {
        return window.document;
    }
    else {
        return void 0;
    }
}
/**
 * A wrapper around an HTMLCanvasElement providing access to the WebGL rendering context
 * and notifications of context loss and restore. An instance of the Engine will usually
 * be a required parameter for any consumer of WebGL resources.
 */
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    /**
     * @param canvas The canvas element identifier, or canvas element, or WebGL rendering context.
     * @param attributes Allows the context to be configured.
     * @param dom The document object model that contains the canvas.
     */
    function Engine(canvas, attributes, dom) {
        if (attributes === void 0) { attributes = {}; }
        var _this = _super.call(this) || this;
        // Remark: We only hold weak references to users so that the lifetime of resource
        // objects is not affected by the fact that they are listening for gl events.
        // Users should automatically add themselves upon construction and remove upon release.
        _this._users = [];
        /**
         * Actions that are executed when a WebGL rendering context is gained.
         */
        _this._commands = new ShareableArray([]);
        _this.setLoggingName('Engine');
        // TODO: Defensive copy and strip off the extra attributes on EngineAttributes just in case the WebGL runtime gets strict and complains.
        _this._attributes = attributes;
        if (isDefined(attributes.contextId)) {
            _this._overrideContextId = mustBeWebGLContextId("attributes.contextId", attributes.contextId);
        }
        if (attributes.eightLogging) {
            _this._commands.pushWeakRef(new EIGHTLogger());
        }
        if (attributes.webglLogging) {
            _this._commands.pushWeakRef(new VersionLogger(_this));
        }
        _this._webGLContextLost = function (event) {
            if (isDefined(_this._gl)) {
                event.preventDefault();
                _this._gl = void 0;
                _this._users.forEach(function (user) {
                    user.contextLost();
                });
            }
        };
        _this._webGLContextRestored = function (event) {
            if (isDefined(_this._gl)) {
                if (_this._gl.canvas instanceof HTMLCanvasElement) {
                    event.preventDefault();
                    var result = initWebGL(_this._gl.canvas, attributes, _this._overrideContextId);
                    _this._gl = checkEnums(result.context);
                    _this._contextId = result.contextId;
                    _this._users.forEach(function (user) {
                        user.contextGain();
                    });
                }
            }
        };
        if (canvas) {
            if (dom) {
                _this.start(canvas, dom);
            }
            else {
                _this.start(canvas, getWindowDocument(window));
            }
        }
        return _this;
    }
    /**
     * @hidden
     */
    Engine.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('Engine');
        this._commands = new ShareableArray([]);
    };
    /**
     * @hidden
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
    Engine.prototype.addContextListener = function (consumer) {
        mustBeNonNullObject('consumer', consumer);
        var index = this._users.indexOf(consumer);
        if (index < 0) {
            this._users.push(consumer);
        }
        else {
            console.warn("consumer already exists for addContextListener");
        }
    };
    Object.defineProperty(Engine.prototype, "canvas", {
        /**
         * The canvas element associated with the WebGLRenderingContext.
         */
        get: function () {
            if (this._gl) {
                if (this._gl.canvas instanceof HTMLCanvasElement) {
                    return this._gl.canvas;
                }
                else {
                    // OffscreenCanvas or undefined.
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        },
        enumerable: false,
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
        enumerable: false,
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
        enumerable: false,
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
        if (mask === void 0) { mask = ClearBufferMask.COLOR_BUFFER_BIT | ClearBufferMask.DEPTH_BUFFER_BIT; }
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
        this._commands.pushWeakRef(new WebGLClearColor(this, red, green, blue, alpha));
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
        this._commands.pushWeakRef(new WebGLDisable(this, capability));
        if (this._gl) {
            this._gl.disable(capability);
        }
        return this;
    };
    /**
     * Enables the specified WebGL capability.
     */
    Engine.prototype.enable = function (capability) {
        this._commands.pushWeakRef(new WebGLEnable(this, capability));
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "contextId", {
        get: function () {
            return this._contextId;
        },
        enumerable: false,
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
     * @param consumer
     */
    Engine.prototype.removeContextListener = function (consumer) {
        mustBeNonNullObject('consumer', consumer);
        var index = this._users.indexOf(consumer);
        if (index >= 0) {
            this._users.splice(index, 1);
        }
    };
    /**
     * A convenience method for setting the width and height properties of the
     * underlying canvas and for setting the viewport to the drawing buffer height and width.
     */
    Engine.prototype.size = function (width, height) {
        this.canvas.width = mustBeNumber('width', width);
        this.canvas.height = mustBeNumber('height', height);
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
     * @param dom The document object model that contains the canvas identifier.
     */
    Engine.prototype.start = function (canvas, dom) {
        if (typeof canvas === 'string') {
            if (dom) {
                var canvasElement = dom.getElementById(canvas);
                if (canvasElement) {
                    // Recursive call but this time the canvas is an HTML canvas element.
                    return this.start(canvasElement, dom);
                }
                else {
                    throw new Error("canvas argument must be a canvas element id or an HTMLCanvasElement.");
                }
            }
            else {
                // Recursive call but this time the document object model is defined.
                return this.start(canvas, getWindowDocument(window));
            }
        }
        else if (canvas instanceof HTMLCanvasElement) {
            if (isDefined(this._gl)) {
                // We'll just be idempotent and ignore the call because we've already been started.
                // To use the canvas might conflict with one we have dynamically created.
                console.warn(this.getLoggingName() + " Ignoring start() because already started.");
                return this;
            }
            else {
                // TODO: Really should strip
                var result = initWebGL(canvas, this._attributes, this._overrideContextId);
                this._gl = checkEnums(result.context);
                this._contextId = result.contextId;
                this.emitStartEvent();
                canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
            }
            return this;
        }
        else {
            if (isDefined(canvas)) {
                this._gl = checkEnums(canvas);
            }
            return this;
        }
    };
    /**
     *
     */
    Engine.prototype.stop = function () {
        if (isDefined(this._gl)) {
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
     * Computes the coordinates of a point in the image cube corresponding to device coordinates.
     * @param deviceX The x-coordinate of the device event.
     * @param deviceY The y-coordinate of the device event.
     * @param imageZ The optional value to use as the resulting depth coordinate.
     */
    Engine.prototype.deviceToImageCoords = function (deviceX, deviceY, imageZ) {
        if (imageZ === void 0) { imageZ = 0; }
        mustBeNumber('deviceX', deviceX);
        mustBeNumber('deviceY', deviceY);
        mustBeNumber('imageZ', imageZ);
        mustBeGE('imageZ', imageZ, -1);
        mustBeLE('imageZ', imageZ, +1);
        var imageX = ((2 * deviceX) / this.canvas.width) - 1;
        var imageY = 1 - (2 * deviceY) / this.canvas.height;
        return vectorFromCoords(imageX, imageY, imageZ);
    };
    return Engine;
}(ShareableBase));
export { Engine };
