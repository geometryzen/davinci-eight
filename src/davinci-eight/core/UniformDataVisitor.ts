import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

interface UniformDataVisitor {
  uniform1f(name: string, x: number);
  uniform2f(name: string, x: number, y: number);
  uniform3f(name: string, x: number, y: number, z: number);
  uniform4f(name: string, x: number, y: number, z: number, w: number);
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1);
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2);
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3);
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4);
  uniformVector1(name: string, vector: Vector1);
  uniformVector2(name: string, vector: Vector2);
  uniformVector3(name: string, vector: Vector3);
  uniformVector4(name: string, vector: Vector4);
}

export = UniformDataVisitor;