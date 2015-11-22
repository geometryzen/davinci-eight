import VectorE3 = require('../math/VectorE3');
import isDefined = require('../checks/isDefined');
import Mat4R = require('../math/Mat4R');
import viewArray = require('../cameras/viewArray');

function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Mat4R): Mat4R {
    let m: Mat4R = isDefined(matrix) ? matrix : Mat4R.one();
    viewArray(eye, look, up, m.elements);
    return m;
}

export = viewMatrix;