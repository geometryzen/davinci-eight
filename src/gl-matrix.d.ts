//
// gl-matrix.d.ts
//
// This (external) module of declarations was manually constructed in order to use the gl-matrix library.
//

declare module x {
}

interface Mat3RService {
  /**
   * Creates a new identity mat3
   */
  create(): number[];
  identity(matrix: number[]): void;
  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
   * @param {Mat3Rx3} out Mat3Rx3 receiving operation result.
   * @param {Mat4R} a Matrix4x4 to derive the normal matrix from
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

interface R3 {

}

interface Vector3Service {
  fromValues(x: number, y: number, z: number): R3;
}

interface glMatrix {
  create(): number;
  mat3: Mat3RService;
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
