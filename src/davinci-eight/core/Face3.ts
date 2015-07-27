import Vector3 = require('../math/Vector3');
/**
 * @class Face3
 */
class Face3 {
  public a: number;
  public b: number;
  public c: number;
  public normal: Vector3;
  /**
   * 0 <=> a, 1 <=> b, 2 <=> c
   */
  public vertexNormals: Vector3[];
  /**
   * @class Face3
   * @constructor
   * @param a {number}
   * @param b {number}
   * @param c {number}
   */
  constructor(a: number, b: number, c: number, normal: Vector3 = new Vector3(), vertexNormals: Vector3[] = []) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal = normal;
    this.vertexNormals = vertexNormals;
  }
}

export = Face3;
