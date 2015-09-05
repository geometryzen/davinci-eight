var isDefined = require('../checks/isDefined');
var Matrix4 = require('../math/Matrix4');
var perspectiveArray = require('../cameras/perspectiveArray');
function perspectiveMatrix(fov, aspect, near, far, matrix) {
    var m = isDefined(matrix) ? matrix : Matrix4.identity();
    perspectiveArray(fov, aspect, near, far, m.data);
    return m;
}
module.exports = perspectiveMatrix;
