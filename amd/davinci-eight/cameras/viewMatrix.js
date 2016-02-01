define(["require", "exports", '../checks/isDefined', '../math/Mat4R', '../cameras/viewArray'], function (require, exports, isDefined_1, Mat4R_1, viewArray_1) {
    function viewMatrix(eye, look, up, matrix) {
        var m = isDefined_1.default(matrix) ? matrix : Mat4R_1.default.one();
        viewArray_1.default(eye, look, up, m.elements);
        return m;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = viewMatrix;
});
