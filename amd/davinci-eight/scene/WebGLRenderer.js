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
     * @class WebGLRenderer
     */
    var WebGLRenderer = (function (_super) {
        __extends(WebGLRenderer, _super);
        /**
         * @class WebGLRenderer
         * @constructor
         * @param canvasBuilder {() => HTMLCanvasElement} The canvas is created lazily, allowing construction during DOM load.
         * @param canvasId [number=0] A user-supplied integer canvas identifier. User is responsible for keeping them unique.
         * @param attributes [WebGLContextAttributes] Allow the context to be configured.
         * @beta
         */
        // FIXME: Move attributes to start()
        function WebGLRenderer(attributes) {
            _super.call(this, 'WebGLRenderer');
            this._kahuna = contextProxy(attributes);
            this._renderer = createRenderer();
            this._kahuna.addContextListener(this._renderer);
        }
        /**
         * @method destructor
         * return {void}
         * @protected
         */
        WebGLRenderer.prototype.destructor = function () {
            this._kahuna.removeContextListener(this._renderer);
            this._kahuna.release();
            this._kahuna = void 0;
            this._renderer.release();
            this._renderer = void 0;
        };
        WebGLRenderer.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(WebGLRenderer.prototype, "autoProlog", {
            /**
             * <p>
             * Determines whether prolog commands are run automatically as part of the `render()` call.
             * </p>
             * @property autoProlog
             * @type boolean
             * @default true
             */
            get: function () {
                return this._renderer.autoProlog;
            },
            set: function (autoProlog) {
                this._renderer.autoProlog = autoProlog;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebGLRenderer.prototype, "canvasElement", {
            get: function () {
                return this._kahuna.canvasElement;
            },
            set: function (canvasElement) {
                this._kahuna.canvasElement = canvasElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebGLRenderer.prototype, "canvasId", {
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
        /* FIXME: Do we need this. Why. Why not kahuna too?
        // No contract says that we need to return this.
        // It's cust that convenience of having someone else do it for you!
        get canvas(): HTMLCanvasElement {
          return this._kahuna
          return this._canvas
        }
        */
        WebGLRenderer.prototype.contextFree = function (canvasId) {
            this._renderer.contextFree(canvasId);
        };
        WebGLRenderer.prototype.contextGain = function (manager) {
            this._renderer.contextGain(manager);
        };
        WebGLRenderer.prototype.contextLoss = function (canvasId) {
            this._renderer.contextLoss(canvasId);
        };
        WebGLRenderer.prototype.createArrayBuffer = function () {
            return this._kahuna.createArrayBuffer();
        };
        WebGLRenderer.prototype.createBufferGeometry = function (elements, mode, usage) {
            return this._kahuna.createBufferGeometry(elements, mode, usage);
        };
        WebGLRenderer.prototype.createTexture2D = function () {
            return this._kahuna.createTexture2D();
        };
        Object.defineProperty(WebGLRenderer.prototype, "gl", {
            get: function () {
                return this._kahuna.gl;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.prolog = function () {
            this._renderer.prolog();
        };
        WebGLRenderer.prototype.pushProlog = function (command) {
            this._renderer.pushProlog(command);
        };
        WebGLRenderer.prototype.pushStartUp = function (command) {
            this._renderer.pushStartUp(command);
        };
        WebGLRenderer.prototype.removeContextListener = function (user) {
            this._kahuna.removeContextListener(user);
        };
        WebGLRenderer.prototype.render = function (drawList, ambients) {
            // FIXME: The camera will provide uniforms, but I need to get them into the renderer loop.
            // This implies camera should implement UniformData and we pass that in as ambients.
            // This allows us to generalize the WebGLRenderer API.
            this._renderer.render(drawList, ambients);
        };
        WebGLRenderer.prototype.setSize = function (width, height) {
            mustBeInteger('width', width);
            mustBeInteger('height', height);
            var canvas = this.canvasElement;
            canvas.width = width;
            canvas.height = height;
            this.gl.viewport(0, 0, width, height);
        };
        WebGLRenderer.prototype.start = function (canvas, canvasId) {
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
        WebGLRenderer.prototype.stop = function () {
            this._kahuna.stop();
        };
        return WebGLRenderer;
    })(Shareable);
    return WebGLRenderer;
});
