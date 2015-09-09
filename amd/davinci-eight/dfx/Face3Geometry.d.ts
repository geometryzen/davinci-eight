import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Face = require('../dfx/Face');
declare class Face3Geometry implements DfxGeometry {
    faces: Face[];
    constructor();
    addFace(face: Face): number;
    accept(visitor: DfxGeometryVisitor): void;
}
export = Face3Geometry;
