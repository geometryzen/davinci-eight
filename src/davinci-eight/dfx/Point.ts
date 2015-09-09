import PointVertex = require('../dfx/PointVertex');

// For symmetry...
class Point {
  public a: PointVertex;
  /**
   * @class Point
   * @constructor
   * @param a {PointVertex}
   */
  constructor(a: PointVertex) {
    this.a = a;
    a.parent = this;
  }
}