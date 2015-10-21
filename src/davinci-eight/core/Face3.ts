import VectorE3 = require('../math/VectorE3');
import MutableVectorE3 = require('../math/MutableVectorE3');
import ColorRGB = require('../core/ColorRGB');
import Color = require('../core/Color');
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
   * length 3 implies per-vertex normals with correspondence index 0 <=> a, 1 <=> b, 2 <=> c.
   * length 1 implies a face normal.
   * length 0 implies
   */
  public vertexNormals: VectorE3[];
  public vertexColors: ColorRGB[];
  public vertexTangents: VectorE3[];
  public normal: VectorE3 = new MutableVectorE3();
  public color: ColorRGB = new Color();
  public materialIndex: number;
  /**
   * @class Face3
   * @constructor
   * @param a {number}
   * @param b {number}
   * @param c {number}
   * @param normals {VectorE3[]} The per-vertex normals for this face (3) or face normal (1).
   */
  constructor(a: number, b: number, c: number, vertexNormals: VectorE3[] = []) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.vertexNormals = vertexNormals;
  }
  clone() {
    let face = new Face3(this.a, this.b, this.c);

    face.normal = MutableVectorE3.copy(this.normal);
    face.color = Color.copy(this.color);

    face.materialIndex = this.materialIndex;

    for ( var i = 0, il = this.vertexNormals.length; i < il; i ++ ) {
      face.vertexNormals[ i ] = MutableVectorE3.copy(this.vertexNormals[i]);
    }

    for ( var i = 0, il = this.vertexColors.length; i < il; i ++ ) {
      face.vertexColors[ i ] = Color.copy(this.vertexColors[i]);
    }

    for ( var i = 0, il = this.vertexTangents.length; i < il; i ++ ) {
      face.vertexTangents[ i ] = MutableVectorE3.copy(this.vertexTangents[i]);
    }
    return face;
  }
}

export = Face3;
