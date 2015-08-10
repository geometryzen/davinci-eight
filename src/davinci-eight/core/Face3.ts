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
   * @param normal {Vector3} The face normal.
   * @param vertexNormals {Vector3[]} The per-vertex normals for this face.
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
