/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
import Matrix4 = require('./Matrix4');
declare var glMatrix: glMatrix;

class Matrix3 {
  public elements: number[] = glMatrix.mat3.create();
  constructor() {
  }
  identity(): void {
    glMatrix.mat3.identity(this.elements);
  }
  normalFromMatrix4(matrix: Matrix4): void {
    glMatrix.mat3.normalFromMat4(this.elements, matrix.elements);
  }
}

export = Matrix3;
