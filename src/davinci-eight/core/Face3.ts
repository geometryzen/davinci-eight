import Vector3 = require('../math/Vector3');

class Face3 {
  public a: number;
  public b: number;
  public c: number;
  public normal: Vector3;
  /**
   * 0 <=> a, 1 <=> b, 2 <=> c
   */
  public vertexNormals: Vector3[];
  constructor(a: number, b: number, c: number, normal?: Vector3|Array<Vector3>) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal = normal instanceof Vector3 ? normal : new Vector3();
    this.vertexNormals = normal instanceof Array ? normal : [];
  }
}

export = Face3;
