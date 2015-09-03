define(["require", "exports", '../cameras/frustumMatrix', '../checks/expectArg'], function (require, exports, frustumMatrix, expectArg) {
    function perspectiveMatrix(fov, aspect, near, far, matrix) {
        // We can leverage the frustum function, although technically the
        // symmetry in this perspective transformation should reduce the amount
        // of computation required.
        expectArg('fov', fov).toBeNumber();
        expectArg('aspect', aspect).toBeNumber();
        expectArg('near', near).toBeNumber();
        expectArg('far', far).toBeNumber();
        var ymax = near * Math.tan(fov * 0.5); // top
        var ymin = -ymax; // bottom
        var xmin = ymin * aspect; // left
        var xmax = ymax * aspect; // right
        return frustumMatrix(xmin, xmax, ymin, ymax, near, far, matrix);
    }
    return perspectiveMatrix;
});
