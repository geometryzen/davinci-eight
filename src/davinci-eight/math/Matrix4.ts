/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
declare var glMatrix: glMatrix;

class Matrix4 {
  public elements: number[] = glMatrix.mat4.create();
  constructor() {
  }
  identity(): void {
    glMatrix.mat4.identity(this.elements);
  }
  makePerspective(fov: number, aspect: number, near: number, far: number): void {
    glMatrix.mat4.perspective(this.elements, fov * Math.PI / 180, aspect, near, far);
  }
  translate(position: { x: number; y: number; z: number }): void {
    glMatrix.mat4.translate(this.elements, this.elements, [position.x, position.y, position.z]);
  }
  rotate(rotation: { yz: number; zx: number; xy: number; w: number }): void {
    glMatrix.mat4.fromQuat(this.elements, [rotation.yz, rotation.zx, rotation.xy, rotation.w]);
  }
  mul(matrix: Matrix4): void {
    glMatrix.mat4.mul(this.elements, this.elements, matrix.elements);
  }
}

export = Matrix4;
