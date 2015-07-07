class Vector3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  sub(v: Vector3): Vector3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  cross(v: Vector3): Vector3 {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
  }
  length(): number {
    let x = this.x;
    let y = this.y;
    let z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  divideScalar(scalar: number): Vector3 {
    if (scalar !== 0) {
      let invScalar = 1 / scalar;
      this.x *= invScalar;
      this.y *= invScalar;
      this.z *= invScalar;
    }
    else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}

export = Vector3;
