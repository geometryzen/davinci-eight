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
        Canvas3D.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(Canvas3D.prototype, "canvas", {
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
            get: function () {
                return this._renderer.commands;
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
        Canvas3D.prototype.contextFree = function (canvasId) {
            this._renderer.contextFree(canvasId);
        };
        Canvas3D.prototype.contextGain = function (manager) {
            this._renderer.contextGain(manager);
        };
        Canvas3D.prototype.contextLost = function (canvasId) {
            this._renderer.contextLost(canvasId);
        };
        Canvas3D.prototype.createArrayBuffer = function () {
            return this._kahuna.createArrayBuffer();
        };
        Canvas3D.prototype.createBufferGeometry = function (elements, usage) {
            return this._kahuna.createBufferGeometry(elements, usage);
        };
        Canvas3D.prototype.createElementArrayBuffer = function () {
            return this._kahuna.createElementArrayBuffer();
        };
        Canvas3D.prototype.createTextureCubeMap = function () {
            return this._kahuna.createTextureCubeMap();
        };
        Canvas3D.prototype.createTexture2D = function () {
            return this._kahuna.createTexture2D();
        };
        Object.defineProperty(Canvas3D.prototype, "gl", {
            get: function () {
                return this._kahuna.gl;
            },
            enumerable: true,
            configurable: true
        });
        Canvas3D.prototype.removeContextListener = function (user) {
            this._kahuna.removeContextListener(user);
        };
        Canvas3D.prototype.setSize = function (width, height) {
            mustBeInteger('width', width);
            mustBeInteger('height', height);
            var canvas = this.canvas;
            canvas.width = width;
            canvas.height = height;
            this.gl.viewport(0, 0, width, height);
        };
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
        Canvas3D.prototype.stop = function () {
            this._kahuna.stop();
        };
        Canvas3D.prototype.synchronize = function (user) {
            this._kahuna.synchronize(user);
        };
        return Canvas3D;
    })(Shareable);
    return Canvas3D;
});
