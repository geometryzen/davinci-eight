var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3 = require('../math/Matrix3');
var Matrix4 = require('../math/Matrix4');
var DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
var Spinor3 = require('../math/Spinor3');
var Symbolic = require('../core/Symbolic');
var Vector3 = require('../math/Vector3');
var Color = require('../core/Color');
var UniformColor = require('../uniforms/UniformColor');
var UNIFORM_MODEL_MATRIX_NAME = 'uModelMatrix';
var UNIFORM_MODEL_MATRIX_TYPE = 'mat4';
var UNIFORM_NORMAL_MATRIX_NAME = 'uNormalMatrix';
var UNIFORM_NORMAL_MATRIX_TYPE = 'mat3';
var UNIFORM_COLOR_NAME = 'uColor';
function modelViewMatrix(position, attitude) {
    var matrix = Matrix4.identity();
    matrix.translation(position);
    var rotation = Matrix4.identity();
    rotation.rotation(attitude);
    matrix.mul(rotation);
    return matrix;
}
/**
 * @class LocalModel
 * @extends DefaultUniformProvider
 */
var LocalModel = (function (_super) {
    __extends(LocalModel, _super);
    /**
     * @class Model
     * @constructor
     */
    function LocalModel() {
        _super.call(this);
        this.position = new Vector3();
        this.attitude = new Spinor3();
        this.scale = new Vector3([1, 1, 1]);
        this.uColor = new UniformColor(UNIFORM_COLOR_NAME, Symbolic.UNIFORM_COLOR);
        this.uColor.data = Color.fromRGB(1, 1, 1);
    }
    Object.defineProperty(LocalModel.prototype, "color", {
        get: function () {
            return this.uColor.data;
        },
        set: function (color) {
            this.uColor.data = color;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @method getUniformVector3
     * @param name {string}
     */
    LocalModel.prototype.getUniformVector3 = function (name) {
        return this.uColor.getUniformVector3(name);
    };
    /**
     * @method getUniformMatrix3
     * @param name {string}
     */
    LocalModel.prototype.getUniformMatrix3 = function (name) {
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
    LocalModel.prototype.getUniformMatrix4 = function (name) {
        switch (name) {
            case UNIFORM_MODEL_MATRIX_NAME:
                {
                    var elements = modelViewMatrix(this.position, this.attitude).elements;
                    return { transpose: false, matrix4: new Float32Array(elements) };
                }
                break;
            default: {
                return this.uColor.getUniformMatrix4(name);
            }
        }
    };
    /**
     * @method getUniformMeta
     */
    LocalModel.prototype.getUniformMeta = function () {
        var uniforms = this.uColor.getUniformMeta();
        uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: UNIFORM_MODEL_MATRIX_NAME, glslType: UNIFORM_MODEL_MATRIX_TYPE };
        uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: UNIFORM_NORMAL_MATRIX_NAME, glslType: UNIFORM_NORMAL_MATRIX_TYPE };
        return uniforms;
    };
    return LocalModel;
})(DefaultUniformProvider);
module.exports = LocalModel;
