var isDefined = require('../checks/isDefined');
var Matrix4 = require('../math/Matrix4');
var viewArray = require('../cameras/viewArray');
function viewMatrix(eye, look, up, matrix) {
    var m = isDefined(matrix) ? matrix : Matrix4.identity();
    viewArray(eye, look, up, m.elements);
    return m;
}
module.exports = viewMatrix;
