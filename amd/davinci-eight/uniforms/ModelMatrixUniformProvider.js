var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../math/Matrix3', '../math/Matrix4', '../uniforms/DefaultUniformProvider', '../core/Symbolic'], function (require, exports, Matrix3, Matrix4, DefaultUniformProvider, Symbolic) {
    var UNIFORM_MODEL_MATRIX_NAME = 'uModelMatrix';
    var UNIFORM_MODEL_MATRIX_TYPE = 'mat4';
    var UNIFORM_NORMAL_MATRIX_NAME = 'uNormalMatrix';
    var UNIFORM_NORMAL_MATRIX_TYPE = 'mat3';
    function modelViewMatrix(position, attitude) {
        var matrix = new Matrix4();
        matrix.identity();
        matrix.translate(position);
        var rotation = new Matrix4();
        rotation.rotate(attitude);
        matrix.mul(rotation);
        return matrix;
    }
    /**
     * @class ModelMatrixUniformProvider
     * @extends DefaultUniformProvider
     */
    var ModelMatrixUniformProvider = (function (_super) {
        __extends(ModelMatrixUniformProvider, _super);
        /**
         * @class Model
         * @constructor
         */
        function ModelMatrixUniformProvider() {
            _super.call(this);
            this.position = { x: 0, y: 0, z: 0 };
            this.attitude = { yz: 0, zx: 0, xy: 0, w: 1 };
        }
        /**
         * @method getUniformMatrix3
         * @param name {string}
         */
        ModelMatrixUniformProvider.prototype.getUniformMatrix3 = function (name) {
            switch (name) {
                case UNIFORM_NORMAL_MATRIX_NAME:
                    {
                        // It's unfortunate that we have to recompute the model-view matrix.
                        // We could cache it, being careful that we don't assume the callback order.
                        // We don't want to compute it in the shader beacause that would be per-vertex.
                        var normalMatrix = new Matrix3();
                        var mv = modelViewMatrix(this.position, this.attitude);
                        normalMatrix.normalFromMatrix4(mv);
                        return { transpose: false, matrix3: new Float32Array(normalMatrix.elements) };
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix3.call(this, name);
                }
            }
        };
        /**
         * @method getUniformMatrix4
         * @param name {string}
         */
        ModelMatrixUniformProvider.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case UNIFORM_MODEL_MATRIX_NAME:
                    {
                        var elements = modelViewMatrix(this.position, this.attitude).elements;
                        return { transpose: false, matrix4: new Float32Array(elements) };
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix4.call(this, name);
                }
            }
        };
        /**
         * @method getUniformMetaInfos
         */
        ModelMatrixUniformProvider.prototype.getUniformMetaInfos = function () {
            return ModelMatrixUniformProvider.getUniformMetaInfos();
        };
        ModelMatrixUniformProvider.getUniformMetaInfos = function () {
            var uniforms = {};
            uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: UNIFORM_MODEL_MATRIX_NAME, type: UNIFORM_MODEL_MATRIX_TYPE };
            uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: UNIFORM_NORMAL_MATRIX_NAME, type: UNIFORM_NORMAL_MATRIX_TYPE };
            return uniforms;
        };
        return ModelMatrixUniformProvider;
    })(DefaultUniformProvider);
    return ModelMatrixUniformProvider;
});
