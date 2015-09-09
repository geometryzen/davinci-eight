import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');

interface DfxGeometry {
  accept(visitor: DfxGeometryVisitor);
}

export = DfxGeometry;