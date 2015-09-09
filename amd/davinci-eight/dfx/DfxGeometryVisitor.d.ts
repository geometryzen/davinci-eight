import Face = require('../dfx/Face');
import Line = require('../dfx/Line');
import Vertex = require('../dfx/Vertex');
interface DfxGeometryVisitor {
    points(points: Vertex[]): any;
    lines(lines: Line[]): any;
    faces(faces: Face[]): any;
}
export = DfxGeometryVisitor;
