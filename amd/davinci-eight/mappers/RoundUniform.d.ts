import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import IFacetVisitor = require('../core/IFacetVisitor');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
declare class RoundUniform implements IFacetVisitor {
    private _next;
    constructor();
    next: IFacetVisitor;
    uniform1f(name: string, x: number, canvasId: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void;
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void;
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void;
    uniformCartesian2(name: string, vector: Vector2): void;
    uniformCartesian3(name: string, vector: Vector3): void;
    uniformCartesian4(name: string, vector: Vector4): void;
    vector2(name: string, data: number[], canvasId: number): void;
    vector3(name: string, data: number[], canvasId: number): void;
    vector4(name: string, data: number[], canvasId: number): void;
}
export = RoundUniform;
