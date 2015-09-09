import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Vertex = require('../dfx/Vertex');

class Point3Geometry implements DfxGeometry {
  private _points: Vertex[] = [];
  constructor() {
  }
  addPoint(point: Vertex): number {
    let newLength = this._points.push(point);
    let index = newLength - 1;
    return index;
  }
  accept(visitor: DfxGeometryVisitor) {
    visitor.points(this._points);
  }
}

export = Point3Geometry;
