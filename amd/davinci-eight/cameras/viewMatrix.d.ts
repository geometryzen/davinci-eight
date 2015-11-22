import VectorE3 = require('../math/VectorE3');
import Mat4R = require('../math/Mat4R');
declare function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Mat4R): Mat4R;
export = viewMatrix;
