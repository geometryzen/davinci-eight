define(["require", "exports", '../utils/contextProxy', '../renderers/renderer', '../checks/mustBeInteger', '../checks/mustSatisfy', '../utils/refChange', '../utils/uuid4'], function (require, exports, contextProxy, createRenderer, mustBeInteger, mustSatisfy, refChange, uuid4) {
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
            this._refCount = 1;
            this._uuid = uuid4().generate();
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
            refChange(this._uuid, LOGGING_NAME, +1);
        }
        WebGLRenderer.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        WebGLRenderer.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME, +1);
            return this._refCount;
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvasId", {
            get: function () {
                return this._canvasId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebGLRenderer.prototype, "gl", {
            // FIXME: Rename this property to gl, which is the normal usage.
            get: function () {
                return this._kahuna.gl;
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
        WebGLRenderer.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME, -1);
            if (this._refCount === 0) {
                this._kahuna.release();
                this._canvas = void 0;
                this._canvasId = void 0;
                this._kahuna = void 0;
                this._refCount = void 0;
                this._renderer = void 0;
                return 0;
            }
            else {
                return this._refCount;
            }
        };
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
