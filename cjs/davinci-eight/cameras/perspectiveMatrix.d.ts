import Matrix4 = require('../math/Matrix4');
declare function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Matrix4): Matrix4;
export = perspectiveMatrix;
