import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Simplex3 = require('../dfx/Simplex3');
declare class Simplex3Geometry implements DfxGeometry {
    faces: Simplex3[];
    constructor();
    addFace(face: Simplex3): number;
    accept(visitor: DfxGeometryVisitor): void;
}
export = Simplex3Geometry;
