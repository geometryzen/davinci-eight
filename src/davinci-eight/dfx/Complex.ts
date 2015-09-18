import checkGeometry = require('../dfx/checkGeometry');
import GeometryInfo = require('../dfx/GeometryInfo');
import Simplex = require('../dfx/Simplex');

/**
 * @class Complex
 */
class Complex {
  public simplices: Simplex[] = [];
  public metadata: GeometryInfo;
  public dynamic = true;
  public verticesNeedUpdate = false;
  public elementsNeedUpdate = false;
  public uvsNeedUpdate = false;
//public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
  constructor() {
  }
  protected mergeVertices(precisionPoints: number = 4) {
    // console.warn("Complex.mergeVertices not yet implemented");
  }
  public boundary(count?: number) {
    this.simplices = Simplex.boundary(this.simplices, count);
    this.check();
  }
  public subdivide(count?: number) {
    this.simplices = Simplex.subdivide(this.simplices, count);
    this.check();
  }
  public check(): void {
    this.metadata = checkGeometry(this.simplices);
  }
}

export = Complex;
