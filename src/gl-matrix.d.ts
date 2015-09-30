//
// gl-matrix.d.ts
//
// This (external) module of declarations was manually constructed in order to use the gl-matrix library.
//

declare module x {
}

interface Matrix3Service {
  /**
   * Creates a new identity mat3
   */
  create(): number[];
  identity(matrix: number[]): void;
  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
   * @param {Matrix3x3} out Matrix3x3 receiving operation result.
   * @param {Matrix4} a Matrix4x4 to derive the normal matrix from
   */
  normalFromMat4(out: number[], a: number[]);
}

interface Matrix4Service {
  create(): number[];
  fromQuat(matrix: number[], q: number[]): void;
  identity(matrix: number[]): void;
  mul(m1: number[], m2: number[], m3: number[]): void;
  perspective(matrix: number[], fov: number, aspect: number, near: number, far: number): void;
  translate(m1: number[], m2: number[], displacement: number[]): void;
}

interface Vector3 {

}

interface Vector3Service {
  fromValues(x: number, y: number, z: number): Vector3;
}

interface glMatrix {
  create(): number;
  mat3: Matrix3Service;
  mat4: Matrix4Service;
  vec3: Vector3Service;
}

declare var x: glMatrix;

// This is not a TypeScript internal module.
// We can reference it by the literal string 'gl-matrix'.
// e.g. import glMatrix = require('gl-matrix');
// var m: Matrix4x4 = glMatrix.mat4.create()
declare module 'gl-matrix' {
    export = x;
}
