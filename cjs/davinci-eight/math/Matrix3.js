var Matrix3 = (function () {
    function Matrix3() {
        this.elements = glMatrix.mat3.create();
    }
    Matrix3.prototype.identity = function () {
        glMatrix.mat3.identity(this.elements);
    };
    Matrix3.prototype.getInverse = function (matrix, throwOnInvertible) {
        // input: THREE.Matrix4
        // ( based on http://code.google.com/p/webgl-mjs/ )
        var me = matrix.elements;
        var te = this.elements;
        te[0] = me[10] * me[5] - me[6] * me[9];
        te[1] = -me[10] * me[1] + me[2] * me[9];
        te[2] = me[6] * me[1] - me[2] * me[5];
        te[3] = -me[10] * me[4] + me[6] * me[8];
        te[4] = me[10] * me[0] - me[2] * me[8];
        te[5] = -me[6] * me[0] + me[2] * me[4];
        te[6] = me[9] * me[4] - me[5] * me[8];
        te[7] = -me[9] * me[0] + me[1] * me[8];
        te[8] = me[5] * me[0] - me[1] * me[4];
        var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
        // no inverse
        if (det === 0) {
            var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible || !throwOnInvertible) {
                throw new Error(msg);
            }
            else {
                console.warn(msg);
            }
            this.identity();
            return this;
        }
        this.multiplyScalar(1.0 / det);
        return this;
    };
    Matrix3.prototype.multiplyScalar = function (s) {
        var m = this.elements;
        m[0] *= s;
        m[3] *= s;
        m[6] *= s;
        m[1] *= s;
        m[4] *= s;
        m[7] *= s;
        m[2] *= s;
        m[5] *= s;
        m[8] *= s;
        return this;
    };
    Matrix3.prototype.normalFromMatrix4 = function (m) {
        this.getInverse(m).transpose();
    };
    Matrix3.prototype.transpose = function () {
        var tmp;
        var m = this.elements;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
    };
    return Matrix3;
})();
module.exports = Matrix3;
