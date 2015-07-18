import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import VertexUniformProvider = require('../core/VertexUniformProvider');
import Spinor3 = require('../math/Spinor3');
import Spinor3Coords = require('../math/Spinor3Coords');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import Cartesian3 = require('../math/Cartesian3');

let UNIFORM_MODEL_MATRIX_NAME = 'uModelMatrix';
let UNIFORM_MODEL_MATRIX_TYPE = 'mat4';

let UNIFORM_NORMAL_MATRIX_NAME = 'uNormalMatrix';
let UNIFORM_NORMAL_MATRIX_TYPE = 'mat3';

function modelViewMatrix(position: Cartesian3, attitude: Spinor3Coords): Matrix4 {
  var matrix = new Matrix4();
  matrix.identity();
  matrix.translate(position);
  var rotation = new Matrix4();
  rotation.rotate(attitude);
  matrix.mul(rotation);
  return matrix;
}

/**
 * @class Model
 * @extends VertexUniformProvider
 */
class Model implements VertexUniformProvider {
  /**
   * @property position
   * @type Cartesian3
   */
  public position: Cartesian3;
    /**
     * @property attitude
     * @type Spinor3Coords
     */
  public attitude: Spinor3Coords;
  /**
   * @class Model
   * @constructor
   */
  constructor() {
    this.position = new Vector3();
    this.attitude = new Spinor3();
  }
  /**
   * @method getUniformVector3
   * @param name {string}
   */
  getUniformVector3(name: string): Vector3 {
    return null;
  }
  /**
   * @method getUniformMatrix3
   * @param name {string}
   */
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
    switch(name) {
      case UNIFORM_NORMAL_MATRIX_NAME: {
        // It's unfortunate that we have to recompute the model-view matrix.
        // We could cache it, being careful that we don't assume the callback order.
        // We don't want to compute it in the shader beacause that would be per-vertex.
        var normalMatrix = new Matrix3();
        var mv = modelViewMatrix(this.position, this.attitude);
        normalMatrix.normalFromMatrix4(mv);
        return {transpose: false, matrix3: new Float32Array(normalMatrix.elements)};
      }
      break;
      default: {
        return null;
      }
    }
  }
  /**
   * @method getUniformMatrix4
   * @param name {string}
   */
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
    switch(name) {
      case UNIFORM_MODEL_MATRIX_NAME: {
        var elements = modelViewMatrix(this.position, this.attitude).elements;
        return {transpose: false, matrix4: new Float32Array(elements)};
      }
      break;
      default: {
        return null;
      }
    }
  }
  /**
   * @method getUniformMetaInfos
   */
  getUniformMetaInfos(): UniformMetaInfos {
    return Model.getUniformMetaInfos();
  }
  static getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = {};
    uniforms[Symbolic.UNIFORM_MODEL_MATRIX]  = {name: UNIFORM_MODEL_MATRIX_NAME,  type: UNIFORM_MODEL_MATRIX_TYPE};
    uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = {name: UNIFORM_NORMAL_MATRIX_NAME, type: UNIFORM_NORMAL_MATRIX_TYPE};
    return uniforms;
  }
}

export = Model;
