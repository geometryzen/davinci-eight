import Vector3 = require('../math/Vector3');

class Vertex {
  public position: Vector3;
  constructor(position: Vector3) {
    this.position = position;
  }
}

export = Vertex;