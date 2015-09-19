import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
declare class RoundUniform implements UniformDataVisitor {
    private _next;
    constructor();
    next: UniformDataVisitor;
    uniform1f(name: string, x: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): void;
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void;
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void;
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void;
    uniformVector1(name: string, vector: Vector1): void;
    uniformVector2(name: string, vector: Vector2): void;
    uniformVector3(name: string, vector: Vector3): void;
    uniformVector4(name: string, vector: Vector4): void;
}
export = RoundUniform;
