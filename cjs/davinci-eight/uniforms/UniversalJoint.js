var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//import Matrix3 = require('../math/Matrix3');
var Matrix4 = require('../math/Matrix4');
var TreeModel = require('../uniforms/TreeModel');
var Spinor3 = require('../math/Spinor3');
var Symbolic = require('../core/Symbolic');
var isUndefined = require('../checks/isUndefined');
//import Color = require('../core/Color');
//import Cartesian3 = require('../math/Cartesian3');
//import UniformColor = require('../uniforms/UniformColor');
function localMatrix(attitude) {
    var matrix = Matrix4.create();
    matrix.identity();
    var rotation = Matrix4.create();
    rotation.rotate(attitude);
    matrix.mul(rotation);
    return matrix;
}
function attitude(theta, phi) {
    var c = Math.cos(theta / 2);
    var s = Math.sin(theta / 2);
    return new Spinor3([s * Math.sin(phi), -s * Math.cos(phi), 0, c]);
}
var UniversalJoint = (function (_super) {
    __extends(UniversalJoint, _super);
    function UniversalJoint(options) {
        _super.call(this);
        this.theta = 0;
        this.phi = 0;
        options = options || {};
        this.modelMatrixVarName = isUndefined(options.modelMatrixVarName) ? Symbolic.UNIFORM_MODEL_MATRIX : options.modelMatrixVarName;
    }
    UniversalJoint.prototype.getUniformMatrix4 = function (name) {
        switch (name) {
            case this.modelMatrixVarName:
                {
                    if (this.getParent()) {
                        var m1 = new Matrix4(this.getParent().getUniformMatrix4(name).matrix4);
                        var m2 = localMatrix(attitude(this.theta, this.phi));
                        var m = Matrix4.create().multiplyMatrices(m1, m2);
                        return { transpose: false, matrix4: m.elements };
                    }
                    else {
                        var m = localMatrix(attitude(this.theta, this.phi));
                        return { transpose: false, matrix4: m.elements };
                    }
                }
                break;
            default: {
                return _super.prototype.getUniformMatrix4.call(this, name);
            }
        }
    };
    return UniversalJoint;
})(TreeModel);
module.exports = UniversalJoint;