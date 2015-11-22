define(["require", "exports", '../checks/isDefined', '../math/Mat4R', '../cameras/viewArray'], function (require, exports, isDefined, Mat4R, viewArray) {
    function viewMatrix(eye, look, up, matrix) {
        var m = isDefined(matrix) ? matrix : Mat4R.one();
        viewArray(eye, look, up, m.elements);
        return m;
    }
    return viewMatrix;
});
