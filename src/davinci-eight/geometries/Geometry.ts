import Face3 = require('../core/Face3');
import Vector3 = require('../math/Vector3');

class Geometry {
  public vertices: Vector3[] = [];
  public verticesNeedUpdate = true;
  public faces: Face3[] = [];
  public elementsNeedUpdate = true;
  public dynamic = true;
  constructor() {

  }
  computeBoundingSphere(): void {
  }
}

export = Geometry;
