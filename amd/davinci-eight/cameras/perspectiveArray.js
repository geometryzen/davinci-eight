define(["require", "exports", '../cameras/frustumMatrix', '../checks/expectArg'], function (require, exports, frustumMatrix_1, expectArg_1) {
    function perspectiveArray(fov, aspect, near, far, matrix) {
        expectArg_1.default('fov', fov).toBeNumber();
        expectArg_1.default('aspect', aspect).toBeNumber();
        expectArg_1.default('near', near).toBeNumber();
        expectArg_1.default('far', far).toBeNumber();
        var ymax = near * Math.tan(fov * 0.5);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        return frustumMatrix_1.default(xmin, xmax, ymin, ymax, near, far, matrix);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = perspectiveArray;
});
