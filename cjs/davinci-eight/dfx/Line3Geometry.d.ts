import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Line = require('../dfx/Line');
declare class Line3Geometry implements DfxGeometry {
    private _lines;
    constructor();
    addLine(line: Line): number;
    accept(visitor: DfxGeometryVisitor): void;
}
export = Line3Geometry;
