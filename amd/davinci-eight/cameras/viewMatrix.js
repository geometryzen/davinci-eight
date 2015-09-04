define(["require", "exports", '../checks/isDefined', '../math/Matrix4', '../cameras/viewArray'], function (require, exports, isDefined, Matrix4, viewArray) {
    function viewMatrix(eye, look, up, matrix) {
        var m = isDefined(matrix) ? matrix : Matrix4.identity();
        viewArray(eye, look, up, m.elements);
        return m;
    }
    return viewMatrix;
});
