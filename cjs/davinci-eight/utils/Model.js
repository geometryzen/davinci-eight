var Matrix3 = require('../math/Matrix3');
var Matrix4 = require('../math/Matrix4');
var Spinor3 = require('../math/Spinor3');
var Vector3 = require('../math/Vector3');
/**
 * Model implements UniformData required for manipulating a body.
 */
var Model = (function () {
    /**
     * Model implements UniformData required for manipulating a body.
     */
    function Model() {
        this.position = new Vector3(); // default is the origin.
        this.attitude = new Spinor3(); // default is unity.
        this.scale = new Vector3([1, 1, 1]); // default is to not scale.
        this.color = new Vector3([1, 1, 1]); // default is white.
        this.position.modified = true;
        this.attitude.modified = true;
        this.scale.modified = true;
        this.color.modified = true;
    }
    Model.prototype.accept = function (visitor) {
        var S = Matrix4.identity();
        S.scaling(this.scale);
        var T = Matrix4.identity();
        T.translation(this.position);
        var R = Matrix4.identity();
        R.rotation(this.attitude);
        var M = T.mul(R.mul(S));
        var N = Matrix3.identity();
        N.normalFromMatrix4(M);
        visitor.uniformMatrix4('uModelMatrix', false, M);
        visitor.uniformMatrix3('uNormalMatrix', false, N);
        visitor.uniformVector3('uColor', this.color);
    };
    return Model;
})();
module.exports = Model;
