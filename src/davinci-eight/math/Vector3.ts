class Vector3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x?: number, y?: number, z?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  add(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  applyQuaternion(q: {x: number, y: number, z: number, w: number}): Vector3 {
    let x = this.x;
    let y = this.y;
    let z = this.z;

    let qx = q.x;
    let qy = q.y;
    let qz = q.z;
    let qw = q.w;

    // calculate quat * vector

    let ix =  qw * x + qy * z - qz * y;
    let iy =  qw * y + qz * x - qx * z;
    let iz =  qw * z + qx * y - qy * x;
    let iw = - qx * x - qy * y - qz * z;

    // calculate (quat * vector) * inverse quat

    this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;
  }
  copy(v: Vector3): Vector3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
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
  length(): number {
    let x = this.x;
    let y = this.y;
    let z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  normalize(): Vector3 {
    return this.divideScalar(this.length());
  }
  sub(v: Vector3): Vector3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  subVectors(a: Vector3, b: Vector3): Vector3 {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}

export = Vector3;
