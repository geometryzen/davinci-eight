import Line = require('../dfx/Line');
import Vertex = require('../dfx/Vertex');
import Vector1 = require('../math/Vector1');
import Vector3 = require('../math/Vector3');

class LineVertex {
  public parent: Line;
  public position: Vector3;
  public normal: Vector3;
  public params: Vector1;
  constructor(position: Vector3, normal?: Vector3) {
    this.position = position;
    this.normal = normal;
  }
}

export = LineVertex;
