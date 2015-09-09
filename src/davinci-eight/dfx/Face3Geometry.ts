import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Vector3 = require('../math/Vector3');
import Face = require('../dfx/Face');

class Face3Geometry implements DfxGeometry {
  public faces: Face[] = [];
  constructor() {
  }
  addFace(face: Face): number {
    let newLength = this.faces.push(face);
    let index = newLength - 1;
    return index;
  }
  accept(visitor: DfxGeometryVisitor) {
    visitor.faces(this.faces);
  }
}

export = Face3Geometry;
