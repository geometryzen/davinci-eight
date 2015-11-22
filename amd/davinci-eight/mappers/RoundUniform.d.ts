import Mat2R = require('../math/Mat2R');
import Mat3R = require('../math/Mat3R');
import Mat4R = require('../math/Mat4R');
import IFacetVisitor = require('../core/IFacetVisitor');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
declare class RoundUniform implements IFacetVisitor {
    private _next;
    constructor();
    next: IFacetVisitor;
    uniform1f(name: string, x: number, canvasId: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    mat2(name: string, matrix: Mat2R, transpose?: boolean): void;
    mat3(name: string, matrix: Mat3R, transpose?: boolean): void;
    mat4(name: string, matrix: Mat4R, transpose?: boolean): void;
    uniformVectorE2(name: string, vector: VectorE2): void;
    uniformVectorE3(name: string, vector: VectorE3): void;
    uniformVectorE4(name: string, vector: VectorE4): void;
    vector2(name: string, data: number[], canvasId: number): void;
    vector3(name: string, data: number[], canvasId: number): void;
    vector4(name: string, data: number[], canvasId: number): void;
}
export = RoundUniform;
