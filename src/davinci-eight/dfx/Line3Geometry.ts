import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Line = require('../dfx/Line');

class Line3Geometry implements DfxGeometry {
  private _lines: Line[] = [];
  constructor() {
  }
  addLine(line: Line): number {
    let newLength = this._lines.push(line);
    let index = newLength - 1;
    return index;
  }
  accept(visitor: DfxGeometryVisitor) {
    visitor.lines(this._lines);
  }
}

export = Line3Geometry;
