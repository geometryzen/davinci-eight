var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../renderers/renderer', '../utils/contextProxy', '../checks/mustBeInteger', '../checks/mustSatisfy', '../utils/Shareable'], function (require, exports, createRenderer, contextProxy, mustBeInteger, mustSatisfy, Shareable) {
    function beHTMLCanvasElement() {
        return "be an HTMLCanvasElement";
    }
    var WebGLRenderer = (function (_super) {
        __extends(WebGLRenderer, _super);
        function WebGLRenderer(canvas, canvasId, attributes) {
            if (canvasId === void 0) { canvasId = 0; }
            _super.call(this, 'WebGLRenderer');
            if (canvas) {
                mustSatisfy('canvas', canvas instanceof HTMLCanvasElement, beHTMLCanvasElement);
                this._canvas = canvas;
            }
            else {
                this._canvas = document.createElement('canvas');
            }
            this._canvasId = mustBeInteger('canvasId', canvasId);
            this._kahuna = contextProxy(this._canvas, canvasId, attributes);
            this._renderer = createRenderer(this._canvas, canvasId);
            this._kahuna.addContextListener(this._renderer);
        }
        WebGLRenderer.prototype.destructor = function () {
            this._kahuna.removeContextListener(this._renderer);
            this._kahuna.release();
            this._kahuna = void 0;
            this._renderer.release();
            this._renderer = void 0;
            this._canvasId = void 0;
            this._canvas = void 0;
        };
        WebGLRenderer.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvasId", {
            get: function () {
                return this._canvasId;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.createDrawElementsMesh = function (elements, mode, usage) {
            return this._kahuna.createDrawElementsMesh(elements, mode, usage);
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.contextFree = function (canvasId) {
            this._renderer.contextFree(canvasId);
        };
        WebGLRenderer.prototype.contextGain = function (manager) {
            this._renderer.contextGain(manager);
        };
        WebGLRenderer.prototype.contextLoss = function (canvasId) {
            this._renderer.contextLoss(canvasId);
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
        WebGLRenderer.prototype.start = function () {
            this._kahuna.start();
        };
        WebGLRenderer.prototype.stop = function () {
            this._kahuna.stop();
        };
        return WebGLRenderer;
    })(Shareable);
    return WebGLRenderer;
});
