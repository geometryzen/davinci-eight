define(["require", "exports", '../renderers/renderer'], function (require, exports, renderer) {
    var WebGLRenderer = (function () {
        function WebGLRenderer() {
            this.renderer = renderer();
        }
        WebGLRenderer.prototype.render = function (scene, ambientUniforms) {
            return this.renderer.render(scene, ambientUniforms);
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
    return WebGLRenderer;
});
