import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import Spinor3 = require('../math/Spinor3');
import Spinor3Coords = require('../math/Spinor3Coords');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import Cartesian3 = require('../math/Cartesian3');
import UniformColor = require('../uniforms/UniformColor');

let UNIFORM_MODEL_MATRIX_NAME = 'uModelMatrix';
let UNIFORM_MODEL_MATRIX_TYPE = 'mat4';

let UNIFORM_NORMAL_MATRIX_NAME = 'uNormalMatrix';
let UNIFORM_NORMAL_MATRIX_TYPE = 'mat3';

let UNIFORM_COLOR_NAME         = 'uColor';

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
 * @class StandardModel
 * @extends DefaultUniformProvider
 */
class StandardModel extends DefaultUniformProvider {
  /**
   * @property position
   * @type Vector3
   */
  public position: Vector3;
    /**
     * @property attitude
     * @type Spinor3Coords
     */
  public attitude: Spinor3;
  /**
   *
   */
  private uColor: UniformColor;
  /**
   * @class Model
   * @constructor
   */
  constructor() {
    super();
    this.position = new Vector3();
    this.attitude = new Spinor3();
    this.uColor = new UniformColor(UNIFORM_COLOR_NAME, Symbolic.UNIFORM_COLOR);
    this.uColor.data = Color.fromRGB(1, 1, 1);
  }
  get color(): Color {
    return this.uColor.data;
  }
  set color(color: Color) {
    this.uColor.data = color;
  }
  /**
   * @method getUniformVector3
   * @param name {string}
   */
  getUniformVector3(name: string) {
    return this.uColor.getUniformVector3(name);
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
        return super.getUniformMatrix3(name);
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
        return this.uColor.getUniformMatrix4(name);
      }
    }
  }
  /**
   * @method getUniformMetaInfos
   */
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = this.uColor.getUniformMetaInfos();
    uniforms[Symbolic.UNIFORM_MODEL_MATRIX]  = {name: UNIFORM_MODEL_MATRIX_NAME,  glslType: UNIFORM_MODEL_MATRIX_TYPE};
    uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = {name: UNIFORM_NORMAL_MATRIX_NAME, glslType: UNIFORM_NORMAL_MATRIX_TYPE};
    return uniforms;
  }
}

export = StandardModel;
