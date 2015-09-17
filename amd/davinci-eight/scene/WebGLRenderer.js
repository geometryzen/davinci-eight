define(["require", "exports", '../utils/contextProxy', '../renderers/renderer', '../checks/mustBeInteger', '../checks/mustSatisfy'], function (require, exports, contextProxy, createRenderer, mustBeInteger, mustSatisfy) {
    var LOGGING_NAME = 'WebGLRenderer';
    // FIXME: ContextManger may be reference counted so this class may need to be too.
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    function beHTMLCanvasElement() {
        return "be an HTMLCanvasElement";
    }
    var WebGLRenderer = (function () {
        function WebGLRenderer(canvas, canvasId, attributes) {
            if (canvasId === void 0) { canvasId = 0; }
            if (canvas) {
                mustSatisfy('canvas', canvas instanceof HTMLCanvasElement, beHTMLCanvasElement, ctorContext);
                this._canvas = canvas;
            }
            else {
                this._canvas = document.createElement('canvas');
            }
            this._canvasId = mustBeInteger('canvasId', canvasId, ctorContext);
            // FIXME: dangerous chaining?
            // FIXME: The proxy is reference counted so WebGLRenderer should be too.
            this._kahuna = contextProxy(this._canvas, canvasId, attributes);
            this._renderer = createRenderer(this._canvas);
            // Provide the manager with access to the WebGLRenderingContext.
            this._kahuna.addContextListener(this._renderer);
        }
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
        Object.defineProperty(WebGLRenderer.prototype, "context", {
            get: function () {
                return this._kahuna.context;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.createDrawElementsMesh = function (elements, mode, usage) {
            return this._kahuna.createDrawElementsMesh(elements, mode, usage);
        };
        Object.defineProperty(WebGLRenderer.prototype, "domElement", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        WebGLRenderer.prototype.removeContextListener = function (user) {
            this._kahuna.removeContextListener(user);
        };
        WebGLRenderer.prototype.render = function (scene, ambients) {
            // FIXME: The camera will provide uniforms, but I need to get them into the renderer loop.
            // This implies camera should implement UniformData and we pass that in as ambients.
            // This allows us to generalize the WebGLRenderer API.
            this._renderer.render(scene, ambients);
        };
        WebGLRenderer.prototype.setClearColor = function (color, alpha) {
            if (alpha === void 0) { alpha = 1.0; }
            console.warn("WegGLRenderer.setClearColor(). Making it up as we go along.");
            this._renderer.clearColor(0.2, 0.2, 0.2, alpha);
        };
        WebGLRenderer.prototype.setSize = function (width, height, updateStyle) {
            console.warn("WegGLRenderer.setSize()");
        };
        WebGLRenderer.prototype.start = function () {
            this._kahuna.start();
        };
        WebGLRenderer.prototype.stop = function () {
            this._kahuna.stop();
        };
        return WebGLRenderer;
    })();
    return WebGLRenderer;
});
