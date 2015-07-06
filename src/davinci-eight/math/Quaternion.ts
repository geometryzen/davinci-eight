class Quaternion {
  public x: number;
  public y: number;
  public z: number;
  public w: number;
  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

export = Quaternion;
