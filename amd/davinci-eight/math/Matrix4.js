define(["require", "exports", "gl-matrix"], function (require, exports, glMatrix) {
    /// <reference path="../../../src/gl-matrix.d.ts" />
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
        Matrix4.prototype.mul = function (matrix) {
            glMatrix.mat4.mul(this.elements, this.elements, matrix.elements);
        };
        return Matrix4;
    })();
    return Matrix4;
});
