var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../renderers/renderer', '../utils/contextProxy', '../core', '../checks/mustBeDefined', '../checks/mustBeInteger', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, createRenderer, contextProxy, core, mustBeDefined, mustBeInteger, readOnly, Shareable) {
    function beHTMLCanvasElement() {
        return "be an HTMLCanvasElement";
    }
    var defaultCanvasBuilder = function () { return document.createElement('canvas'); };
    /**
     * @class Canvas3D
     */
    var Canvas3D = (function (_super) {
        __extends(Canvas3D, _super);
        /**
         * @class Canvas3D
         * @constructor
         * @param canvasBuilder {() => HTMLCanvasElement} The canvas is created lazily, allowing construction during DOM load.
         * @param canvasId [number=0] A user-supplied integer canvas identifier. User is responsible for keeping them unique.
         * @param attributes [WebGLContextAttributes] Allow the context to be configured.
         * @beta
         */
        // FIXME: Move attributes to start()
        function Canvas3D(attributes) {
            _super.call(this, 'Canvas3D');
            this._kahuna = contextProxy(attributes);
            this._renderer = createRenderer();
            this._kahuna.addContextListener(this._renderer);
            this._kahuna.synchronize(this._renderer);
        }
        /**
         * @method destructor
         * return {void}
         * @protected
         */
        Canvas3D.prototype.destructor = function () {
            this._kahuna.removeContextListener(this._renderer);
            this._kahuna.release();
            this._kahuna = void 0;
            this._renderer.release();
            this._renderer = void 0;
            _super.prototype.destructor.call(this);
        };
        /**
         * @method addContextListener
         * @param user {IContextConsumer}
         * @return {void}
         */
        Canvas3D.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(Canvas3D.prototype, "canvas", {
            /**
             * @property canvas
             * @type {HTMLCanvasElement}
             */
            get: function () {
                return this._kahuna.canvas;
            },
            set: function (canvas) {
                this._kahuna.canvas = canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas3D.prototype, "canvasId", {
            /**
             * @property canvasId
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._kahuna.canvasId;
            },
            set: function (unused) {
                // FIXME: DRY delegate to kahuna? Should give the same result.
                throw new Error(readOnly('canvasId').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas3D.prototype, "commands", {
            /**
             * @property commands
             * @type {IUnknownArray}
             * @beta
             */
            get: function () {
                return this._renderer.commands;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
         * <p>
         * @method clearColor
         * @param red {number}
         * @param green {number}
         * @param blue {number}
         * @param alpha {number}
         * @return {void}
         */
        Canvas3D.prototype.clearColor = function (red, green, blue, alpha) {
            return this._renderer.clearColor(red, green, blue, alpha);
        };
        /**
         * @method contextFree
         * @param canvasId {number}
         * @return {void}
         */
        Canvas3D.prototype.contextFree = function (canvasId) {
            return this._renderer.contextFree(canvasId);
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        Canvas3D.prototype.contextGain = function (manager) {
            return this._renderer.contextGain(manager);
        };
        /**
         * @method contextLost
         * @param canvasId {number}
         * @return {void}
         */
        Canvas3D.prototype.contextLost = function (canvasId) {
            this._renderer.contextLost(canvasId);
        };
        /**
         * @method createArrayBuffer
         * @return {IBuffer}
         */
        Canvas3D.prototype.createArrayBuffer = function () {
            return this._kahuna.createArrayBuffer();
        };
        /**
         * @method createBufferGeometry
         * @param primitive {DrawPrimitive}
         * @param usage [number]
         * @return {IBufferGeometry}
         */
        Canvas3D.prototype.createBufferGeometry = function (primitive, usage) {
            return this._kahuna.createBufferGeometry(primitive, usage);
        };
        /**
         * @method createElementArrayBuffer
         * @return {IBuffer}
         */
        Canvas3D.prototype.createElementArrayBuffer = function () {
            return this._kahuna.createElementArrayBuffer();
        };
        /**
         * @method createTextureCubeMap
         * @return {ITextureCubeMap}
         */
        Canvas3D.prototype.createTextureCubeMap = function () {
            return this._kahuna.createTextureCubeMap();
        };
        /**
         * @method createTexture2D
         * @return {ITexture2D}
         */
        Canvas3D.prototype.createTexture2D = function () {
            return this._kahuna.createTexture2D();
        };
        /**
         * Turns off specific WebGL capabilities for this context.
         * @method disable
         * @param capability {Capability}
         * @return {void} This method does not return a value.
         */
        Canvas3D.prototype.disable = function (capability) {
            return this._renderer.disable(capability);
        };
        /**
         * Turns on specific WebGL capabilities for this context.
         * @method enable
         * @param capability {Capability}
         * @return {void} This method does not return a value.
         */
        Canvas3D.prototype.enable = function (capability) {
            return this._renderer.enable(capability);
        };
        Object.defineProperty(Canvas3D.prototype, "gl", {
            /**
             * @property gl
             * @type {WebGLRenderingContext}
             * @readOnly
             */
            get: function () {
                return this._kahuna.gl;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method removeContextListener
         * @param user {IContextConsumer}
         * @return {void}
         */
        Canvas3D.prototype.removeContextListener = function (user) {
            return this._kahuna.removeContextListener(user);
        };
        /**
         * Defines what part of the canvas will be used in rendering the drawing buffer.
         * @method viewport
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         * @return {void} This method does not return a value.
         */
        Canvas3D.prototype.viewport = function (x, y, width, height) {
            return this._renderer.viewport(x, y, width, height);
        };
        /**
         * @method start
         * @param canvas {HTMLCanvasElement}
         * @param canvasId {number}
         * @return {void}
         */
        Canvas3D.prototype.start = function (canvas, canvasId) {
            // FIXME: DRY delegate to kahuna.
            if (!(canvas instanceof HTMLElement)) {
                if (core.verbose) {
                    console.warn("canvas must be an HTMLCanvasElement to start the context.");
                }
                return;
            }
            mustBeDefined('canvas', canvas);
            mustBeInteger('canvasId', canvasId);
            this._kahuna.start(canvas, canvasId);
        };
        /**
         * @method stop
         * @return {void}
         */
        Canvas3D.prototype.stop = function () {
            return this._kahuna.stop();
        };
        /**
         * @method synchronize
         * @param user {IContextConsumer}
         * @return {void}
         */
        Canvas3D.prototype.synchronize = function (user) {
            return this._kahuna.synchronize(user);
        };
        return Canvas3D;
    })(Shareable);
    return Canvas3D;
});
