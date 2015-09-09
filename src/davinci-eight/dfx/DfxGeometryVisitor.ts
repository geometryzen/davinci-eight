import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');
import Face = require('../dfx/Face');
import Line = require('../dfx/Line');
import Vertex = require('../dfx/Vertex');

interface DfxGeometryVisitor {
  points(points: Vertex[]);
  lines(lines: Line[]);
  faces(faces: Face[]);
}

export = DfxGeometryVisitor;
