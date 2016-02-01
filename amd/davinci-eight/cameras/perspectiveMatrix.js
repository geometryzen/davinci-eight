define(["require", "exports", '../checks/isDefined', '../math/Mat4R', '../cameras/perspectiveArray'], function (require, exports, isDefined_1, Mat4R_1, perspectiveArray_1) {
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : Mat4R_1.default.one();
        perspectiveArray_1.default(fov, aspect, near, far, m.elements);
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = perspectiveMatrix;
});
