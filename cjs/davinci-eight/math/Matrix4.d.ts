/// <reference path="../../../src/gl-matrix.d.ts" />
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
    mul(matrix: Matrix4): void;
}
export = Matrix4;
