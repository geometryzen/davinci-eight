var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../renderers/renderer', '../utils/contextProxy', '../checks/mustBeDefined', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, renderer_1, contextProxy_1, mustBeDefined_1, readOnly_1, Shareable_1) {
    var GraphicsContext = (function (_super) {
        __extends(GraphicsContext, _super);
        function GraphicsContext(attributes) {
            _super.call(this, 'GraphicsContext');
            this._kahuna = contextProxy_1.default(attributes);
            this._renderer = renderer_1.default();
            this._kahuna.addContextListener(this._renderer);
            this._kahuna.synchronize(this._renderer);
        }
        GraphicsContext.prototype.destructor = function () {
            this._kahuna.removeContextListener(this._renderer);
            this._kahuna.release();
            this._kahuna = void 0;
            this._renderer.release();
            this._renderer = void 0;
            _super.prototype.destructor.call(this);
        };
        GraphicsContext.prototype.addContextListener = function (user) {
            this._kahuna.addContextListener(user);
        };
        Object.defineProperty(GraphicsContext.prototype, "canvas", {
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
            get: function () {
                return this._kahuna.canvasId;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('canvasId').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicsContext.prototype, "commands", {
            get: function () {
                return this._renderer.commands;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('commands').message);
            },
            enumerable: true,
            configurable: true
        });
        GraphicsContext.prototype.clearColor = function (red, green, blue, alpha) {
            this._renderer.clearColor(red, green, blue, alpha);
            return this;
        };
        GraphicsContext.prototype.contextFree = function (canvasId) {
            return this._renderer.contextFree(canvasId);
        };
        GraphicsContext.prototype.contextGain = function (manager) {
            return this._renderer.contextGain(manager);
        };
        GraphicsContext.prototype.contextLost = function (canvasId) {
            this._renderer.contextLost(canvasId);
        };
        GraphicsContext.prototype.createArrayBuffer = function () {
            return this._kahuna.createArrayBuffer();
        };
        GraphicsContext.prototype.createBufferGeometry = function (primitive, usage) {
            return this._kahuna.createBufferGeometry(primitive, usage);
        };
        GraphicsContext.prototype.createElementArrayBuffer = function () {
            return this._kahuna.createElementArrayBuffer();
        };
        GraphicsContext.prototype.createTextureCubeMap = function () {
            return this._kahuna.createTextureCubeMap();
        };
        GraphicsContext.prototype.createTexture2D = function () {
            return this._kahuna.createTexture2D();
        };
        GraphicsContext.prototype.disable = function (capability) {
            this._renderer.disable(capability);
            return this;
        };
        GraphicsContext.prototype.enable = function (capability) {
            this._renderer.enable(capability);
            return this;
        };
        Object.defineProperty(GraphicsContext.prototype, "gl", {
            get: function () {
                return this._kahuna.gl;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('gl').message);
            },
            enumerable: true,
            configurable: true
        });
        GraphicsContext.prototype.removeContextListener = function (user) {
            return this._kahuna.removeContextListener(user);
        };
        GraphicsContext.prototype.viewport = function (x, y, width, height) {
            this._renderer.viewport(x, y, width, height);
            return this;
        };
        GraphicsContext.prototype.start = function (canvas, canvasId) {
            if (!(canvas instanceof HTMLCanvasElement)) {
                console.warn("canvas must be an HTMLCanvasElement to start the context.");
                return this;
            }
            mustBeDefined_1.default('canvas', canvas);
            this._kahuna.start(canvas, canvasId);
            return this;
        };
        GraphicsContext.prototype.stop = function () {
            this._kahuna.stop();
            return this;
        };
        GraphicsContext.prototype.synchronize = function (consumer) {
            return this._kahuna.synchronize(consumer);
        };
        return GraphicsContext;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsContext;
});
