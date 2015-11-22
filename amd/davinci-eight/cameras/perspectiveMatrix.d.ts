import Mat4R = require('../math/Mat4R');
declare function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Mat4R): Mat4R;
export = perspectiveMatrix;
