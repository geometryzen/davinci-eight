import Vector3 = require('../math/Vector3');
/**
 * @class Face3
 */
class Face3 {
  /**
   * @property a {number} The index of the vertex with label 'a' in the array of vertices.
   */
  public a: number;
  /**
   * @property b {number} The index of the vertex with label 'b' in the array of vertices.
   */
  public b: number;
  /**
   * @property c {number} The index of the vertex with label 'c' in the array of vertices.
   */
  public c: number;
  /**
   * length 3 implies index 0 <=> a, 1 <=> b, 2 <=> c. length 1 implies a face normal.
   */
  public normals: Vector3[];
  /**
   * @class Face3
   * @constructor
   * @param a {number}
   * @param b {number}
   * @param c {number}
   * @param normals {Vector3[]} The per-vertex normals for this face (3) or face normal (1).
   */
  constructor(a: number, b: number, c: number, normals: Vector3[] = []) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normals = normals;
  }
}

export = Face3;
