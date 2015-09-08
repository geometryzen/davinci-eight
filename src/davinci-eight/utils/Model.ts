import Color = require('../core/Color');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import Spinor3 = require('../math/Spinor3');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * Model implements UniformData required for manipulating a body.
 */ 
class Model implements UniformData {
  public position: Vector3 = new Vector3();        // default is the origin.
  public attitude: Spinor3 = new Spinor3();        // default is unity.
  public scale: Vector3 = new Vector3([1, 1, 1]);  // default is to not scale.
  public color: Vector3 = new Vector3([1, 1, 1]);  // default is white.
  /**
   * Model implements UniformData required for manipulating a body.
   */ 
  constructor() {
    this.position.modified = true;
    this.attitude.modified = true;
    this.scale.modified = true;
    this.color.modified = true;
  }
  accept(visitor: UniformDataVisitor) {
    var S = Matrix4.identity();
    S.scaling(this.scale);
    var T = Matrix4.identity();
    T.translation(this.position);
    var R = Matrix4.identity();
    R.rotation(this.attitude);

    let M = T.mul(R.mul(S));
    
    let N: Matrix3 = Matrix3.identity();
    N.normalFromMatrix4(M);

    visitor.uniformMatrix4('uModelMatrix', false, M);
    visitor.uniformMatrix3('uNormalMatrix', false, N);
    visitor.uniformVector3('uColor', this.color);
  }
}

export = Model;
