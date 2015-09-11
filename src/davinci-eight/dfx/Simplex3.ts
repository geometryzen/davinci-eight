import expectArg = require('../checks/expectArg');
import Simplex3Vertex = require('../dfx/Simplex3Vertex');
import Vector3 = require('../math/Vector3');
import makeSimplex3NormalCallback = require('../dfx/makeSimplex3NormalCallback');

function expectArgVector3(name: string, vector: Vector3): Vector3 {
  return expectArg(name, vector).toSatisfy(vector instanceof Vector3, name + ' must be a Vector3').value;
}

class Simplex3 {
  public a: Simplex3Vertex;
  public b: Simplex3Vertex;
  public c: Simplex3Vertex;
  private _normal: Vector3 = new Vector3();
  /**
   * @class Simplex3
   * @constructor
   * @param a {Simplex3Vertex}
   * @param b {Simplex3Vertex}
   * @param c {Simplex3Vertex}
   */
  constructor(a: Vector3, b: Vector3, c: Vector3) {
    this.a = new Simplex3Vertex(expectArgVector3('a', a));
    this.b = new Simplex3Vertex(expectArgVector3('b', b));
    this.c = new Simplex3Vertex(expectArgVector3('c', c));
    this.a.parent = this;
    this.b.parent = this;
    this.c.parent = this;
    this._normal.callback = makeSimplex3NormalCallback(this);
  }
  get normal() {
    return this._normal;
  }
  public static indices(face: Simplex3): number[] {
    return [face.a.index, face.b.index, face.c.index];
  }
  private static subdivideOne(face: Simplex3): Simplex3[] {
    let faces = new Array<Simplex3>();

    let aVertex: Simplex3Vertex = face.a;
    let a = aVertex.position;
    let bVertex: Simplex3Vertex = face.b;
    let b = bVertex.position;
    let cVertex: Simplex3Vertex = face.c;
    let c = cVertex.position;

    var m1 = a.clone().lerp(b, 0.5);
    var m2 = b.clone().lerp(c, 0.5);
    var m3 = c.clone().lerp(a, 0.5);
    
    var face1 = new Simplex3(c, m3, m2);
    var face2 = new Simplex3(a, m1, m3);
    var face3 = new Simplex3(b, m2, m1);
    var face4 = new Simplex3(m1, m2, m3);
    
    faces.push(face1);
    faces.push(face2);
    faces.push(face3);
    faces.push(face4);

    return faces;
  }
  public static subdivide(faces: Simplex3[]): Simplex3[] {
    return faces.map(Simplex3.subdivideOne).reduce(function(a: Simplex3[], b: Simplex3[]) {return a.concat(b);},[]);
  }
}

export = Simplex3;