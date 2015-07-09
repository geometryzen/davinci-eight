define(["require", "exports", "gl-matrix"], function (require, exports, glMatrix) {
    var Matrix4 = (function () {
        function Matrix4() {
            this.elements = glMatrix.mat4.create();
        }
        Matrix4.prototype.identity = function () {
            glMatrix.mat4.identity(this.elements);
        };
        Matrix4.prototype.makePerspective = function (fov, aspect, near, far) {
            glMatrix.mat4.perspective(this.elements, fov * Math.PI / 180, aspect, near, far);
        };
        Matrix4.prototype.translate = function (position) {
            glMatrix.mat4.translate(this.elements, this.elements, [position.x, position.y, position.z]);
        };
        Matrix4.prototype.rotate = function (rotation) {
            glMatrix.mat4.fromQuat(this.elements, [rotation.yz, rotation.zx, rotation.xy, rotation.w]);
        };
        Matrix4.prototype.makeRotationAxis = function (axis, angle) {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
            return this;
        };
        Matrix4.prototype.mul = function (matrix) {
            glMatrix.mat4.mul(this.elements, this.elements, matrix.elements);
        };
        Matrix4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.elements;
            te[0] = n11;
            te[4] = n12;
            te[8] = n13;
            te[12] = n14;
            te[1] = n21;
            te[5] = n22;
            te[9] = n23;
            te[13] = n24;
            te[2] = n31;
            te[6] = n32;
            te[10] = n33;
            te[14] = n34;
            te[3] = n41;
            te[7] = n42;
            te[11] = n43;
            te[15] = n44;
            return this;
        };
        return Matrix4;
    })();
    return Matrix4;
});
