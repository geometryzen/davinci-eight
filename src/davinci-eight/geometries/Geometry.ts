import Simplex = require('../dfx/Simplex');

/**
 * @class Geometry
 */
class Geometry {
  //public simplices: Simplex[] = [];
  public dynamic = true;
  public verticesNeedUpdate = false;
  public elementsNeedUpdate = false;
  public uvsNeedUpdate = false;
//public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
  constructor() {
  }
  protected mergeVertices(precisionPoints: number = 4) {
    console.warn("Geometry.mergeVertices not yet implemented");
  }
}

export = Geometry;
