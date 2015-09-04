import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Vector3 = require('../math/Vector3');
interface UniformDataVisitor {
    uniform1f(name: string, x: number): any;
    uniform1fv(name: string, value: number[]): any;
    uniform2f(name: string, x: number, y: number): any;
    uniform2fv(name: string, value: number[]): any;
    uniform3f(name: string, x: number, y: number, z: number): any;
    uniform4f(name: string, x: number, y: number, z: number, w: number): any;
    uniform4fv(name: string, value: number[]): any;
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): any;
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): any;
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): any;
    uniformVector3(name: string, vector: Vector3): any;
}
export = UniformDataVisitor;
