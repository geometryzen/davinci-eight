define(["require", "exports", '../checks/isDefined', '../math/Matrix4', '../cameras/perspectiveArray'], function (require, exports, isDefined, Matrix4, perspectiveArray) {
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        var m = isDefined(matrix) ? matrix : Matrix4.one();
        perspectiveArray(fov, aspect, near, far, m.elements);
        return m;
    }
    return perspectiveMatrix;
});
