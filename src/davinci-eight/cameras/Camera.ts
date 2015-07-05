/// <reference path='../renderers/UniformProvider.d.ts'/>
/// <reference path='../materials/UniformMetaInfo.d.ts'/>
import Matrix4 = require('../math/Matrix4');

declare var glMatrix: glMatrix;
let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
let UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';

class Camera implements UniformProvider {
  public projectionMatrix: Matrix4 = new Matrix4();
  constructor(spec?) {
  }
  getUniformMatrix3(name: string) {
    return null;
  }
  getUniformMatrix4(name: string) {
    switch(name) {
      case UNIFORM_PROJECTION_MATRIX_NAME: {
        var value: Float32Array = new Float32Array(this.projectionMatrix.elements);
        return {transpose: false, matrix4: value};
      }
      default: {
        return null;
      }
    }
  }
  static getUniformMetaInfo(): UniformMetaInfo {
    return {projectionMatrix:{name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE}};
  }
}

export = Camera;