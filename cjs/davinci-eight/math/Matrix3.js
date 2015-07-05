var Matrix3 = (function () {
    function Matrix3() {
        this.elements = glMatrix.mat3.create();
    }
    Matrix3.prototype.identity = function () {
        glMatrix.mat3.identity(this.elements);
    };
    Matrix3.prototype.normalFromMatrix4 = function (matrix) {
        glMatrix.mat3.normalFromMat4(this.elements, matrix.elements);
    };
    return Matrix3;
})();
module.exports = Matrix3;
