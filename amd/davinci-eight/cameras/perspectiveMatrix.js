define(["require", "exports", '../checks/isDefined', '../math/Mat4R', '../cameras/perspectiveArray'], function (require, exports, isDefined, Mat4R, perspectiveArray) {
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        var m = isDefined(matrix) ? matrix : Mat4R.one();
        perspectiveArray(fov, aspect, near, far, m.elements);
        return m;
    }
    return perspectiveMatrix;
});
