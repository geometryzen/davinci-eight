import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import Face = require('../dfx/Face');
import Vertex = require('../dfx/Vertex');
import Vector3 = require('../math/Vector3');
import VectorN = require('../math/VectorN');
import makeFaceNormalCallback = require('../dfx/makeFaceNormalCallback');

// Remark: If positions are defined as VectorN (as they may be), then normals must be custom.
class FaceVertex {
  private _parent: Face;
  public position: VectorN<number>;
  public normal: VectorN<number>;
  public attributes: {[name:string]: VectorN<number>} = {}
  public index: number;
  constructor(position: VectorN<number>, normal?: VectorN<number>) {
    this.position = position;
    this.normal = normal;
  }
  get parent() {
    return this._parent;
  }
  set parent(value) {
    this._parent = value;
    if (isUndefined(this.normal)) {
      // Interesting how we start out as a Vector3.
      this.normal = new Vector3();
      this.normal.callback = makeFaceNormalCallback(this._parent);
    }
  }
}

export = FaceVertex;
