/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
// Be careful not to create circularity.
// Only use Vector3 in type positions.
// Otherwise, create standalone functions.
import Vector3 = require('../math/Vector3');

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
  makeRotationAxis(axis: Vector3, angle: number) {

    // Based on http://www.gamedev.net/reference/articles/article1199.asp

    var c = Math.cos( angle );
    var s = Math.sin( angle );
    var t = 1 - c;
    var x = axis.x, y = axis.y, z = axis.z;
    var tx = t * x, ty = t * y;

    this.set(

      tx * x + c, tx * y - s * z, tx * z + s * y, 0,
      tx * y + s * z, ty * y + c, ty * z - s * x, 0,
      tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
      0, 0, 0, 1

    );

     return this;

  }
  mul(matrix: Matrix4): void {
    glMatrix.mat4.mul(this.elements, this.elements, matrix.elements);
  }
  set(
    n11: number,
    n12: number,
    n13: number,
    n14: number,
    n21: number,
    n22: number,
    n23: number,
    n24: number,
    n31: number,
    n32: number,
    n33: number,
    n34: number,
    n41: number,
    n42: number,
    n43: number,
    n44: number): Matrix4 {

    var te: number[] = this.elements;

    te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
    te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
    te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
    te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

    return this;
  }
}

export = Matrix4;
