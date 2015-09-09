import Face = require('../dfx/Face');
import Vertex = require('../dfx/Vertex');
import Vector2 = require('../math/Vector2');

class FaceVertexTexCoord {
  public face: Face;
  public vertex: Vertex;
  public uv: Vector2;
  constructor(face: Face, vertex: Vertex, uv: Vector2) {
    this.face = face;
    this.vertex = vertex;
    this.uv = uv;
  }
}

export = FaceVertexTexCoord;
