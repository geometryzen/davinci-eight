define(["require", "exports", '../math/Matrix4'], function (require, exports, Matrix4) {
    var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
    var Camera = (function () {
        function Camera(spec) {
            this.projectionMatrix = new Matrix4();
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
        Camera.getUniformMetaInfo = function () {
            return { projectionMatrix: { name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE } };
        };
        return Camera;
    })();
    return Camera;
});
