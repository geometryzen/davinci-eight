import LineVertex = require('../dfx/LineVertex');

class Line {
  public a: LineVertex;
  public b: LineVertex;
  /**
   * @class Line
   * @constructor
   * @param a {LineVertex}
   * @param b {LineVertex}
   */
  constructor(a: LineVertex, b: LineVertex) {
    this.a = a;
    this.b = b;
    a.parent = this;
    b.parent = this;
  }
}

export = Line;