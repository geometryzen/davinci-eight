import Simplex3 = require('../dfx/Simplex3');
import Vertex = require('../dfx/Vertex');
import Vector2 = require('../math/Vector2');

class Simplex3VertexTexCoord {
  public face: Simplex3;
  public vertex: Vertex;
  public uv: Vector2;
  constructor(face: Simplex3, vertex: Vertex, uv: Vector2) {
    this.face = face;
    this.vertex = vertex;
    this.uv = uv;
  }
}

export = Simplex3VertexTexCoord;
