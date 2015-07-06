/// <reference path='../renderers/UniformProvider.d.ts'/>
/// <reference path='../materials/UniformMetaInfo.d.ts'/>
/// <reference path='../core/Drawable.d.ts'/>
var Matrix4 = require('../math/Matrix4');
var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
// Camera implements Drawable purely so that we can add it to the Scene.
// However, since we don't actually draw it, it's not an issue.
// Maybe one day there will be multiple cameras and we might make them visible?
var Camera = (function () {
    function Camera(spec) {
        this.projectionMatrix = new Matrix4();
        this.fakeHasContext = false;
    }
    Camera.prototype.getUniformMatrix3 = function (name) {
        return null;
    };
    Camera.prototype.getUniformMatrix4 = function (name) {
        switch (name) {
            case UNIFORM_PROJECTION_MATRIX_NAME: {
                var value = new Float32Array(this.projectionMatrix.elements);
                return { transpose: false, matrix4: value };
            }
            default: {
                return null;
            }
        }
    };
    Object.defineProperty(Camera.prototype, "drawGroupName", {
        get: function () {
            // Anything will do here as long as nothing else uses the same group name; the Camera won't be drawn.
            return "Camera";
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.useProgram = function (context) {
        // Thanks, but I'm not going to be drawn so I don't need a program.
    };
    Camera.prototype.draw = function (context, time, uniformProvider) {
        // Do nothing.
    };
    Camera.prototype.contextFree = function (context) {
        this.fakeHasContext = false;
    };
    Camera.prototype.contextGain = function (context, contextId) {
        this.fakeHasContext = true;
    };
    Camera.prototype.contextLoss = function () {
        this.fakeHasContext = false;
    };
    Camera.prototype.hasContext = function () {
        return this.fakeHasContext;
    };
    Camera.getUniformMetaInfo = function () {
        return { projectionMatrix: { name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE } };
    };
    return Camera;
})();
module.exports = Camera;
