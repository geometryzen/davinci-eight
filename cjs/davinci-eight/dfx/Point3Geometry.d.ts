import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Vertex = require('../dfx/Vertex');
declare class Point3Geometry implements DfxGeometry {
    private _points;
    constructor();
    addPoint(point: Vertex): number;
    accept(visitor: DfxGeometryVisitor): void;
}
export = Point3Geometry;
