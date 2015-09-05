import Cartesian3 = require('../math/Cartesian3');
import isDefined = require('../checks/isDefined');
import Matrix4 = require('../math/Matrix4');
import viewArray = require('../cameras/viewArray');

function viewMatrix(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4): Matrix4 {
  let m: Matrix4 = isDefined(matrix) ? matrix : Matrix4.identity();
  viewArray(eye, look, up, m.data);
  return m;
}

export = viewMatrix;