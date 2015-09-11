import Simplex3 = require('../dfx/Simplex3');
import Line = require('../dfx/Line');
import Vertex = require('../dfx/Vertex');
interface DfxGeometryVisitor {
    points(points: Vertex[]): any;
    lines(lines: Line[]): any;
    faces(faces: Simplex3[]): any;
}
export = DfxGeometryVisitor;
