import Vector3 = require('../math/Vector3');

class Sphere {
  public center: Vector3;
  public radius: number;
  constructor(center?: Vector3, radius?: number) {
    this.center = ( center !== undefined ) ? center : new Vector3();
    this.radius = ( radius !== undefined ) ? radius : 0;
  }
  setFromPoints(points: Vector3[]) {
    throw new Error("Not Implemented: Sphere.setFromPoints");
  }
}

export = Sphere;
