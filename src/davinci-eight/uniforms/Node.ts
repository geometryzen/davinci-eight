import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import TreeModel = require('../uniforms/TreeModel');
import Spinor3 = require('../math/Spinor3');
import Spinor3Coords = require('../math/Spinor3Coords');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import Cartesian3 = require('../math/Cartesian3');
import UniformColor = require('../uniforms/UniformColor');

function localMatrix(scale: Cartesian3, attitude: Spinor3Coords, position: Cartesian3): Matrix4 {

  var S = Matrix4.identity();
  S.scaling(scale);

  var T = Matrix4.identity();
  T.translation(position);

  var R = Matrix4.identity();
  R.rotation(attitude);

  T.mul(R.mul(S));
  return T;
}

/**
 * @class Node
 * @extends TreeModel
 */
class Node extends TreeModel {
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
   * @property position
   * @type Vector3
   */
  public scale: Vector3;
  /**
   *
   */
  private modelMatrixName: string;
  /**
   *
   */
  private normalMatrixName: string;
  /**
   *
   */
  private colorVarName: string;
  /**
   *
   */
  private uColor: UniformColor;
  /**
   * @class Model
   * @constructor
   */
  constructor(
    options?: {
      modelMatrixName?: string,
      normalMatrixName?: string,
      colorVarName?: string
    }) {
    super();
    options = options || {};
    this.modelMatrixName = options.modelMatrixName || Symbolic.UNIFORM_MODEL_MATRIX;
    this.normalMatrixName = options.normalMatrixName || Symbolic.UNIFORM_NORMAL_MATRIX;
    this.colorVarName = options.colorVarName || Symbolic.UNIFORM_COLOR;
    this.position = new Vector3();
    this.attitude = new Spinor3();
    this.scale = new Vector3([1, 1, 1]);
    this.uColor = new UniformColor(this.colorVarName, Symbolic.UNIFORM_COLOR);
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
    //console.log("getUniformVector3(name='" + name + "')");
    switch(name) {
      case this.colorVarName: {
        if (this.uColor.data) {
          return this.uColor.getUniformVector3(name);
        }
        else if (this.getParent()) {
          return this.getParent().getUniformVector3(name);
        }
        else {
          return Color.fromRGB(1, 1, 1).data;
        }
      }
      break;
      default: {
        return super.getUniformVector3(name);
      }
    }
  }
  /**
   * @method getUniformMatrix3
   * @param name {string}
   */
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
    switch(name) {
      case this.normalMatrixName: {
        // It's unfortunate that we have to recompute the model-view matrix.
        // We could cache it, being careful that we don't assume the callback order.
        // We don't want to compute it in the shader beacause that would be per-vertex.
        var normalMatrix = Matrix3.identity();
        var mv = localMatrix(this.scale, this.attitude, this.position);
        normalMatrix.normalFromMatrix4(mv);
        // TODO: elements in Matrix3 should already be Float32Array
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
      case this.modelMatrixName: {
        if (this.getParent()) {
          var um4 = this.getParent().getUniformMatrix4(name);
          if (um4) {
            var m1 = new Matrix4(um4.matrix4);
            var m2 = localMatrix(this.scale, this.attitude, this.position);
            var m = Matrix4.identity().multiplyMatrices(m1, m2);
            return {transpose: false, matrix4: m.elements};
          }
          else {
            var m = localMatrix(this.scale, this.attitude, this.position);
            return {transpose: false, matrix4: m.elements};
          }
        }
        else {
          var m = localMatrix(this.scale, this.attitude, this.position);
          return {transpose: false, matrix4: m.elements};
        }
      }
      break;
      default: {
        return this.uColor.getUniformMatrix4(name);
      }
    }
  }
  /**
   * @method getUniformMeta
   */
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = this.uColor.getUniformMeta();
    uniforms[Symbolic.UNIFORM_MODEL_MATRIX]  = {name: this.modelMatrixName,  glslType: 'mat4'};
    uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = {name: this.normalMatrixName, glslType: 'mat3'};
    return uniforms;
  }
}

export = Node;
