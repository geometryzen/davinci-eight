import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');
import Simplex3 = require('../dfx/Simplex3');
import Line = require('../dfx/Line');
import Vertex = require('../dfx/Vertex');

interface DfxGeometryVisitor {
  points(points: Vertex[]);
  lines(lines: Line[]);
  faces(faces: Simplex3[]);
}

export = DfxGeometryVisitor;
