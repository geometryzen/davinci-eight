import VectorE3 = require('../math/VectorE3');
import Matrix4 = require('../math/Matrix4');
declare function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Matrix4): Matrix4;
export = viewMatrix;
