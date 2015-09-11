import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import Simplex3 = require('../dfx/Simplex3');
import Vertex = require('../dfx/Vertex');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
import makeSimplex3NormalCallback = require('../dfx/makeSimplex3NormalCallback');

// Remark: If positions are defined as VectorN (as they may be), then normals must be custom.
class Simplex3Vertex {
  private _parent: Simplex3;
  public position: Vector3;
  public normal: Vector3;
  public attributes: {[name:string]: VectorN<number>} = {}
  public index: number;
  constructor(position: Vector3, normal?: Vector3) {
    this.position = position;
    this.normal = normal;
  }
  get parent() {
    return this._parent;
  }
  set parent(value) {
    this._parent = value;
    if (isUndefined(this.normal)) {
      this.normal = new Vector3();
      this.normal.callback = makeSimplex3NormalCallback(this._parent);
    }
  }
}

export = Simplex3Vertex;
