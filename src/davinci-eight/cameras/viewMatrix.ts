import VectorE3 = require('../math/VectorE3');
import isDefined = require('../checks/isDefined');
import Matrix4 = require('../math/Matrix4');
import viewArray = require('../cameras/viewArray');

function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Matrix4): Matrix4 {
    let m: Matrix4 = isDefined(matrix) ? matrix : Matrix4.one();
    viewArray(eye, look, up, m.elements);
    return m;
}

export = viewMatrix;