var Matrix3 = require('../math/Matrix3');
var Matrix4 = require('../math/Matrix4');
var rotor3 = require('../math/rotor3');
var Symbolic = require('../core/Symbolic');
var Vector3 = require('../math/Vector3');
/**
 * Model implements UniformData required for manipulating a body.
 */
var Model = (function () {
    function Model() {
        this.position = new Vector3();
        this.attitude = rotor3();
        this.scale = new Vector3([1, 1, 1]);
        this.color = new Vector3([1, 1, 1]);
        this.M = Matrix4.identity();
        this.N = Matrix3.identity();
        this.R = Matrix4.identity();
        this.S = Matrix4.identity();
        this.T = Matrix4.identity();
        this.position.modified = true;
        this.attitude.modified = true;
        this.scale.modified = true;
        this.color.modified = true;
    }
    Model.prototype.accept = function (visitor) {
        if (this.position.modified) {
            this.T.translation(this.position);
            this.position.modified = false;
        }
        if (this.attitude.modified) {
            this.R.rotation(this.attitude);
            this.attitude.modified = false;
        }
        if (this.scale.modified) {
            this.S.scaling(this.scale);
            this.scale.modified = false;
        }
        this.M.copy(this.T).multiply(this.R).multiply(this.S);
        this.N.normalFromMatrix4(this.M);
        visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.M);
        visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N);
        visitor.uniformVector3(Symbolic.UNIFORM_COLOR, this.color);
    };
    return Model;
})();
module.exports = Model;
