import DfxGeometry = require('../dfx/DfxGeometry');
import DfxGeometryVisitor = require('../dfx/DfxGeometryVisitor');
import Vector3 = require('../math/Vector3');
import Simplex3 = require('../dfx/Simplex3');

class Simplex3Geometry implements DfxGeometry {
  public faces: Simplex3[] = [];
  constructor() {
  }
  addFace(face: Simplex3): number {
    let newLength = this.faces.push(face);
    let index = newLength - 1;
    return index;
  }
  accept(visitor: DfxGeometryVisitor) {
    visitor.faces(this.faces);
  }
}

export = Simplex3Geometry;
