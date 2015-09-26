define(["require", "exports", '../math/Matrix3', '../math/Matrix4', '../math/rotor3', '../core/Symbolic', '../math/Vector3'], function (require, exports, Matrix3, Matrix4, createRotor3, Symbolic, Vector3) {
    /**
     * Model3 implements UniformData required for manipulating a body.
     */
    // TODO: What should we call this?
    var Model3 = (function () {
        function Model3() {
            this.position = new Vector3();
            this.attitude = createRotor3();
            this.scaleXYZ = new Vector3([1, 1, 1]);
            this.colorRGB = new Vector3([1, 1, 1]);
            this.M = Matrix4.identity();
            this.N = Matrix3.identity();
            this.R = Matrix4.identity();
            this.S = Matrix4.identity();
            this.T = Matrix4.identity();
            this.position.modified = true;
            this.attitude.modified = true;
            this.scaleXYZ.modified = true;
            this.colorRGB.modified = true;
        }
        Model3.prototype.setUniforms = function (visitor, canvasId) {
            if (this.position.modified) {
                this.T.translation(this.position);
                this.position.modified = false;
            }
            if (this.attitude.modified) {
                this.R.rotation(this.attitude);
                this.attitude.modified = false;
            }
            if (this.scaleXYZ.modified) {
                this.S.scaling(this.scaleXYZ);
                this.scaleXYZ.modified = false;
            }
            this.M.copy(this.T).multiply(this.R).multiply(this.S);
            this.N.normalFromMatrix4(this.M);
            visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.M, canvasId);
            visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N, canvasId);
            visitor.uniformVector3(Symbolic.UNIFORM_COLOR, this.colorRGB, canvasId);
        };
        return Model3;
    })();
    return Model3;
});
