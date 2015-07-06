/// <reference path='../renderers/Renderer'/>
/// <reference path='../worlds/World'/>
var renderer = require('../renderers/renderer');
var WebGLRenderer = (function () {
    function WebGLRenderer() {
        this.renderer = renderer();
    }
    WebGLRenderer.prototype.render = function (world, ambientUniforms) {
        return this.renderer.render(world, ambientUniforms);
    };
    WebGLRenderer.prototype.contextFree = function (context) {
        return this.renderer.contextFree(context);
    };
    WebGLRenderer.prototype.contextGain = function (context, contextId) {
        return this.renderer.contextGain(context, contextId);
    };
    WebGLRenderer.prototype.contextLoss = function () {
        return this.renderer.contextLoss();
    };
    WebGLRenderer.prototype.hasContext = function () {
        return this.renderer.hasContext();
    };
    WebGLRenderer.prototype.clearColor = function (r, g, b, a) {
        this.renderer.clearColor(r, g, b, a);
    };
    WebGLRenderer.prototype.setClearColor = function (color, alpha) {
        alpha = (typeof alpha === 'number') ? alpha : 1.0;
        // TODO:
        this.renderer.clearColor(1.0, 1.0, 1.0, alpha);
    };
    WebGLRenderer.prototype.setSize = function (width, height) {
        return this.renderer.setSize(width, height);
    };
    Object.defineProperty(WebGLRenderer.prototype, "domElement", {
        get: function () {
            return this.renderer.domElement;
        },
        enumerable: true,
        configurable: true
    });
    return WebGLRenderer;
})();
module.exports = WebGLRenderer;
