import Cartesian3 = require('../math/Cartesian3');

class Sphere {
  public center: Cartesian3;
  public radius: number;
  constructor(center?: Cartesian3, radius?: number) {
    this.center = (center !== undefined) ? center : { x: 0, y: 0, z: 0 };
    this.radius = ( radius !== undefined ) ? radius : 0;
  }
  setFromPoints(points: Cartesian3[]) {
    throw new Error("Not Implemented: Sphere.setFromPoints");
  }
}

export = Sphere;
