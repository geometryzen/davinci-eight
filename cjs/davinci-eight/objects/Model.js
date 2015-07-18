var Matrix3 = require('../math/Matrix3');
var Matrix4 = require('../math/Matrix4');
var Spinor3 = require('../math/Spinor3');
var Symbolic = require('../core/Symbolic');
var Vector3 = require('../math/Vector3');
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
 * @class Model
 * @extends VertexUniformProvider
 */
var Model = (function () {
    /**
     * @class Model
     * @constructor
     */
    function Model() {
        this.position = new Vector3();
        this.attitude = new Spinor3();
    }
    /**
     * @method getUniformVector3
     * @param name {string}
     */
    Model.prototype.getUniformVector3 = function (name) {
        return null;
    };
    /**
     * @method getUniformMatrix3
     * @param name {string}
     */
    Model.prototype.getUniformMatrix3 = function (name) {
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
                return null;
            }
        }
    };
    /**
     * @method getUniformMatrix4
     * @param name {string}
     */
    Model.prototype.getUniformMatrix4 = function (name) {
        switch (name) {
            case UNIFORM_MODEL_MATRIX_NAME:
                {
                    var elements = modelViewMatrix(this.position, this.attitude).elements;
                    return { transpose: false, matrix4: new Float32Array(elements) };
                }
                break;
            default: {
                return null;
            }
        }
    };
    /**
     * @method getUniformMetaInfos
     */
    Model.prototype.getUniformMetaInfos = function () {
        return Model.getUniformMetaInfos();
    };
    Model.getUniformMetaInfos = function () {
        var uniforms = {};
        uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: UNIFORM_MODEL_MATRIX_NAME, type: UNIFORM_MODEL_MATRIX_TYPE };
        uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: UNIFORM_NORMAL_MATRIX_NAME, type: UNIFORM_NORMAL_MATRIX_TYPE };
        return uniforms;
    };
    return Model;
})();
module.exports = Model;
