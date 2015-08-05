//import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import TreeModel = require('../uniforms/TreeModel');
import Spinor3 = require('../math/Spinor3');
import Spinor3Coords = require('../math/Spinor3Coords');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import isUndefined = require('../checks/isUndefined');

function localMatrix(attitude: Spinor3Coords): Matrix4 {
  // TODO: Why don't we have a static constructor?
  var matrix = Matrix4.create();
  matrix.makeRotation(attitude);
  return matrix;
}

function attitude(theta: number, phi: number): Spinor3Coords {
  let c = Math.cos(theta / 2);
  let s = Math.sin(theta / 2);
  return new Spinor3([s * Math.sin(phi), -s * Math.cos(phi), 0, c]);
}

class UniversalJoint extends TreeModel {
  public theta: number = 0;
  public phi: number = 0;
  private modelMatrixVarName: string;
  constructor(options?: {modelMatrixVarName?: string}) {
    super();
    options = options || {};
    this.modelMatrixVarName = isUndefined(options.modelMatrixVarName) ? Symbolic.UNIFORM_MODEL_MATRIX : options.modelMatrixVarName;
  }
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
    switch(name) {
      case this.modelMatrixVarName: {
        if (this.getParent()) {
          var m1 = new Matrix4(this.getParent().getUniformMatrix4(name).matrix4);
          var m2 = localMatrix(attitude(this.theta, this.phi));
          var m = Matrix4.create().multiplyMatrices(m1, m2);
          return {transpose: false, matrix4: m.elements};

        }
        else {
          var m = localMatrix(attitude(this.theta, this.phi));
          return {transpose: false, matrix4: m.elements};
        }
      }
      break;
      default: {
        return super.getUniformMatrix4(name);
      }
    }
  }
}

export = UniversalJoint;