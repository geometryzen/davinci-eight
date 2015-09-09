import Point = require('../dfx/Point');
import Vertex = require('../dfx/Vertex');
import Vector1 = require('../math/Vector1');
import Vector3 = require('../math/Vector3');

class PointVertex {
  public parent: Point;
  public position: Vector3;
  public normal: Vector3;
  constructor(position: Vector3, normal?: Vector3) {
    this.position = position;
    this.normal = normal;
  }
}

export = PointVertex;
