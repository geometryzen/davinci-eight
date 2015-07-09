/// <reference path="../../../src/gl-matrix.d.ts" />
import Vector3 = require('../math/Vector3');
declare class Matrix4 {
    elements: number[];
    constructor();
    identity(): void;
    makePerspective(fov: number, aspect: number, near: number, far: number): void;
    translate(position: {
        x: number;
        y: number;
        z: number;
    }): void;
    rotate(rotation: {
        yz: number;
        zx: number;
        xy: number;
        w: number;
    }): void;
    makeRotationAxis(axis: Vector3, angle: number): Matrix4;
    mul(matrix: Matrix4): void;
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): Matrix4;
}
export = Matrix4;
