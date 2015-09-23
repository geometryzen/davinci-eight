import Color = require('../core/Color');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import createRotor3 = require('../math/rotor3');
import Rotor3 = require('../math/Rotor3');
import Spinor3 = require('../math/Spinor3');
import Symbolic = require('../core/Symbolic');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * Model implements UniformData required for manipulating a body.
 */
// TODO: What should we call this?
class Model implements UniformData {
  public position = new Vector3();
  public attitude = createRotor3();
  public scale: Vector3 = new Vector3([1, 1, 1]);
  public color: Vector3 = new Vector3([1, 1, 1]);
  private M = Matrix4.identity();
  private N = Matrix3.identity();
  private R = Matrix4.identity();
  private S = Matrix4.identity();
  private T = Matrix4.identity();
  constructor() {
    this.position.modified = true;
    this.attitude.modified = true;
    this.scale.modified = true;
    this.color.modified = true;
  }
  setUniforms(visitor: UniformDataVisitor, canvasId: number) {
    if (this.position.modified) {
      this.T.translation(this.position);
      this.position.modified = false;
    }
    if (this.attitude.modified) {
        this.R.rotation(this.attitude);
        this.attitude.modified = false;
    }
    if (this.scale.modified) {
      this.S.scaling(this.scale);
      this.scale.modified = false;
    }
    this.M.copy(this.T).multiply(this.R).multiply(this.S);

    this.N.normalFromMatrix4(this.M)

    visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.M, canvasId);
    visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N, canvasId);
    visitor.uniformVector3(Symbolic.UNIFORM_COLOR, this.color, canvasId);
  }
}

export = Model;
