import Cartesian3 = require('../math/Cartesian3');
import Matrix4 = require('../math/Matrix4');
declare function viewMatrix(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4): Matrix4;
export = viewMatrix;
