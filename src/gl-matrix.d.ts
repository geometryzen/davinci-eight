//
// gl-matrix.d.ts
//

declare module x {
}

interface Matrix3Service {
    /**
     * Creates a new identity mat3
     */
    create(): number[];
    /**
     * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
     * @param {Matrix3x3} out Matrix3x3 receiving operation result.
     * @param {Matrix4} a Matrix4x4 to derive the normal matrix from
     */
    normalFromMat4(out: number[], a: number[]);
}

interface Matrix4Service {
    create(): number[];
    perspective(matrix: number[], fov: number, aspect: number, near: number, far: number): void;
    fromRotationTranslation(matrix: number[], q: Quaternion, v: Vector3): void;
}

interface Vector3 {

}

interface Vector3Service {
      fromValues(x: number, y: number, z: number): Vector3;
}

interface Quaternion {

}

interface QuaternionService {
      fromValues(x: number, y: number, z: number, w:number): Quaternion;
}

interface glMatrix {
    create(): number;
    mat3: Matrix3Service;
    mat4: Matrix4Service;
    vec3: Vector3Service;
    quat: QuaternionService;
}

declare var x: glMatrix;

// This is not a TypeScript internal module.
// We can reference it by the literal string 'gl-matrix'.
// e.g. import glMatrix = require('gl-matrix');
// var m: Matrix4x4 = glMatrix.mat4.create()
declare module 'gl-matrix' {
    export = x;
}
