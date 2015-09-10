import expectArg = require('../checks/expectArg');
import FaceVertex = require('../dfx/FaceVertex');
import Vector3 = require('../math/Vector3');
import makeFaceNormalCallback = require('../dfx/makeFaceNormalCallback');

function expectArgVector3(name: string, vector: Vector3): Vector3 {
  return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
}

class Face {
  public a: FaceVertex;
  public b: FaceVertex;
  public c: FaceVertex;
  private _normal: Vector3 = new Vector3();
  /**
   * @class Face
   * @constructor
   * @param a {FaceVertex}
   * @param b {FaceVertex}
   * @param c {FaceVertex}
   */
  constructor(a: Vector3, b: Vector3, c: Vector3) {
    this.a = new FaceVertex(expectArgVector3('a', a));
    this.b = new FaceVertex(expectArgVector3('b', b));
    this.c = new FaceVertex(expectArgVector3('c', c));
    this.a.parent = this;
    this.b.parent = this;
    this.c.parent = this;
    this._normal.callback = makeFaceNormalCallback(this);
  }
  get normal() {
    return this._normal;
  }
  public static indices(face: Face): number[] {return [face.a.index, face.b.index, face.c.index];}
}

export = Face;