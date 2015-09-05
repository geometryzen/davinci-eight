import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
interface UniformDataVisitor {
    uniform1f(name: string, x: number): any;
    uniform2f(name: string, x: number, y: number): any;
    uniform3f(name: string, x: number, y: number, z: number): any;
    uniform4f(name: string, x: number, y: number, z: number, w: number): any;
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): any;
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): any;
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): any;
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): any;
    uniformVector1(name: string, vector: Vector1): any;
    uniformVector2(name: string, vector: Vector2): any;
    uniformVector3(name: string, vector: Vector3): any;
    uniformVector4(name: string, vector: Vector4): any;
}
export = UniformDataVisitor;
