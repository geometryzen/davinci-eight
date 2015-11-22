import R1 = require('../math/R1');
import Mat2R = require('../math/Mat2R');
import Mat3R = require('../math/Mat3R');
import Mat4R = require('../math/Mat4R');
import IFacetVisitor = require('../core/IFacetVisitor');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');

class RoundUniform implements IFacetVisitor {
    private _next: IFacetVisitor;
    constructor() {
    }
    get next() {
        // FIXME: No reference counting yet.
        return this._next;
    }
    set next(next: IFacetVisitor) {
        // FIXME: No reference counting yet.
        this._next = next;
    }
    uniform1f(name: string, x: number, canvasId: number): void {
        if (this._next) {
            this._next.uniform1f(name, Math.round(x), canvasId);
        }
    }
    uniform2f(name: string, x: number, y: number): void {
        console.warn("uniform");
    }
    uniform3f(name: string, x: number, y: number, z: number): void {
        console.warn("uniform");
    }
    uniform4f(name: string, x: number, y: number, z: number, w: number): void {
        console.warn("uniform");
    }
    mat2(name: string, matrix: Mat2R, transpose?: boolean): void {
        console.warn("uniform");
    }
    mat3(name: string, matrix: Mat3R, transpose?: boolean): void {
        console.warn("uniform");
    }
    mat4(name: string, matrix: Mat4R, transpose?: boolean): void {
        console.warn("uniform");
    }
    uniformVectorE2(name: string, vector: VectorE2): void {
        console.warn("uniformVectorE2");
    }
    uniformVectorE3(name: string, vector: VectorE3): void {
        console.warn("uniformVectorE3");
    }
    uniformVectorE4(name: string, vector: VectorE4): void {
        console.warn("uniformVectorE4");
    }
    vector2(name: string, data: number[], canvasId: number): void {
        this._next.vector2(name, data, canvasId)
    }
    vector3(name: string, data: number[], canvasId: number): void {
        this._next.vector3(name, data, canvasId)
    }
    vector4(name: string, data: number[], canvasId: number): void {
        this._next.vector4(name, data, canvasId)
    }
}

export = RoundUniform;