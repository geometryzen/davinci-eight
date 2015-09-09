import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import Face = require('../dfx/Face');
import Vertex = require('../dfx/Vertex');
import Vector3 = require('../math/Vector3');
import Vector2 = require('../math/Vector2');
import makeFaceNormalCallback = require('../dfx/makeFaceNormalCallback');

function expectArgVector3(name: string, vector: Vector3): Vector3 {
  return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
}

class FaceVertex {
  private _parent: Face;
  public position: Vector3;
  public normal: Vector3;
  public coords: Vector2;
  public index: number;
  constructor(position: Vector3, normal?: Vector3, coords?: Vector2) {
    this.position = expectArgVector3('position', position);
    this.normal = normal;
    this.coords = coords;
  }
  get parent() {
    return this._parent;
  }
  set parent(value) {
    this._parent = value;
    if (isUndefined(this.normal)) {
      this.normal = new Vector3();
      this.normal.callback = makeFaceNormalCallback(this._parent);
    }
  }
}

export = FaceVertex;
