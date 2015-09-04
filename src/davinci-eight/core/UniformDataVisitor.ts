import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Vector3 = require('../math/Vector3');

interface UniformDataVisitor {
  uniform1f(name: string, x: number);
  uniform1fv(name: string, value: number[]);
  uniform2f(name: string, x: number, y: number);
  uniform2fv(name: string, value: number[]);
  uniform3f(name: string, x: number, y: number, z: number);
  uniform4f(name: string, x: number, y: number, z: number, w: number);
  uniform4fv(name: string, value: number[]);
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2);
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3);
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4);
  uniformVector3(name: string, vector: Vector3);
}

export = UniformDataVisitor;