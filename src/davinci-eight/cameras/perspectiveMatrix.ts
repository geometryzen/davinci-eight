import VectorE3 = require('../math/VectorE3');
import isDefined = require('../checks/isDefined');
import Mat4R = require('../math/Mat4R');
import perspectiveArray = require('../cameras/perspectiveArray');

function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Mat4R): Mat4R {
    let m: Mat4R = isDefined(matrix) ? matrix : Mat4R.one();
    perspectiveArray(fov, aspect, near, far, m.elements);
    return m;
}

export = perspectiveMatrix;