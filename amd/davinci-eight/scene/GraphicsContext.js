var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../renderers/renderer', '../utils/contextProxy', '../core', '../checks/mustBeDefined', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, createRenderer, contextProxy, core, mustBeDefined, readOnly, Shareable) {
    function beHTMLCanvasElement() {
        return "be an HTMLCanvasElement";
    }
    var defaultCanvasBuilder = function () { return document.createElement('canvas'); };
    /**
     * @class GraphicsContext
     * @extends Shareable
     */
    var GraphicsContext = (function (_super) {
        __extends(GraphicsContext, _super);
        /**
         * @class GraphicsContext
         * @constructor
         * @param [attributes] {WebGLContextAttributes} Allow the context to be configured.
         * @beta
         */
        function GraphicsContext(attributes) {
            _super.call(this, 'GraphicsContext');
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
        GraphicsContext.prototype.destructor = function () {
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
        GraphicsContext.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(GraphicsContext.prototype, "canvas", {
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
        Object.defineProperty(GraphicsContext.prototype, "canvasId", {
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
        Object.defineProperty(GraphicsContext.prototype, "commands", {
            /**
             * @property commands
             * @type {IUnknownArray}
             * @beta
             * @readOnly
             */
            get: function () {
                return this._renderer.commands;
            },
            set: function (unused) {
                throw new Error(readOnly('commands').message);
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
         * @return {GraphicsContext}
         * @chainable
         */
        GraphicsContext.prototype.clearColor = function (red, green, blue, alpha) {
            this._renderer.clearColor(red, green, blue, alpha);
            return this;
        };
        /**
         * @method contextFree
         * @param [canvasId] {number}
         * @return {void}
         */
        GraphicsContext.prototype.contextFree = function (canvasId) {
            return this._renderer.contextFree(canvasId);
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        GraphicsContext.prototype.contextGain = function (manager) {
            return this._renderer.contextGain(manager);
        };
        /**
         * @method contextLost
         * @param [canvasId] {number}
         * @return {void}
         */
        GraphicsContext.prototype.contextLost = function (canvasId) {
            this._renderer.contextLost(canvasId);
        };
        /**
         * @method createArrayBuffer
         * @return {IBuffer}
         */
        GraphicsContext.prototype.createArrayBuffer = function () {
            return this._kahuna.createArrayBuffer();
        };
        /**
         * @method createBufferGeometry
         * @param primitive {Primitive}
         * @param [usage] {number}
         * @return {IBufferGeometry}
         */
        GraphicsContext.prototype.createBufferGeometry = function (primitive, usage) {
            return this._kahuna.createBufferGeometry(primitive, usage);
        };
        /**
         * @method createElementArrayBuffer
         * @return {IBuffer}
         */
        GraphicsContext.prototype.createElementArrayBuffer = function () {
            return this._kahuna.createElementArrayBuffer();
        };
        /**
         * @method createTextureCubeMap
         * @return {ITextureCubeMap}
         */
        GraphicsContext.prototype.createTextureCubeMap = function () {
            return this._kahuna.createTextureCubeMap();
        };
        /**
         * @method createTexture2D
         * @return {ITexture2D}
         */
        GraphicsContext.prototype.createTexture2D = function () {
            return this._kahuna.createTexture2D();
        };
        /**
         * Turns off specific WebGL capabilities for this context.
         * @method disable
         * @param capability {Capability}
         * @return {GraphicsContext}
         * @chainable
         */
        GraphicsContext.prototype.disable = function (capability) {
            this._renderer.disable(capability);
            return this;
        };
        /**
         * Turns on specific WebGL capabilities for this context.
         * @method enable
         * @param capability {Capability}
         * @return {GraphicsContext}
         * @chainable
         */
        GraphicsContext.prototype.enable = function (capability) {
            this._renderer.enable(capability);
            return this;
        };
        Object.defineProperty(GraphicsContext.prototype, "gl", {
            /**
             * @property gl
             * @type {WebGLRenderingContext}
             * @readOnly
             */
            get: function () {
                return this._kahuna.gl;
            },
            set: function (unused) {
                throw new Error(readOnly('gl').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method removeContextListener
         * @param user {IContextConsumer}
         * @return {void}
         */
        GraphicsContext.prototype.removeContextListener = function (user) {
            return this._kahuna.removeContextListener(user);
        };
        /**
         * Defines what part of the canvas will be used in rendering the drawing buffer.
         * @method viewport
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         * @return {GraphicsContext}
         * @chainable
         */
        GraphicsContext.prototype.viewport = function (x, y, width, height) {
            this._renderer.viewport(x, y, width, height);
            return this;
        };
        /**
         * Initializes the WebGL context for the specified <code>canvas</code>.
         * @method start
         * @param canvas {HTMLCanvasElement} The HTML canvas element.
         * @param [canvasId] {number} An optional user-defined alias for the canvas when using multi-canvas.
         * @return {GraphicsContext}
         * @chainable
         */
        GraphicsContext.prototype.start = function (canvas, canvasId) {
            // FIXME: DRY delegate to kahuna.
            if (!(canvas instanceof HTMLCanvasElement)) {
                if (core.verbose) {
                    console.warn("canvas must be an HTMLCanvasElement to start the context.");
                }
                return this;
            }
            mustBeDefined('canvas', canvas);
            this._kahuna.start(canvas, canvasId);
            return this;
        };
        /**
         * @method stop
         * @return {GraphicsContext}
         * @chainable
         */
        GraphicsContext.prototype.stop = function () {
            this._kahuna.stop();
            return this;
        };
        /**
         * @method synchronize
         * @param user {IContextConsumer}
         * @return {void}
         */
        GraphicsContext.prototype.synchronize = function (user) {
            return this._kahuna.synchronize(user);
        };
        return GraphicsContext;
    })(Shareable);
    return GraphicsContext;
});
