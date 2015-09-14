import Cartesian3 = require('../math/Cartesian3');
import Rotor3 = require('../math/Rotor3');
import Spinor3Coords = require('../math/Spinor3Coords');
import VectorN = require('../math/VectorN');
import wedgeXY = require('../math/wedgeXY');
import wedgeYZ = require('../math/wedgeYZ');
import wedgeZX = require('../math/wedgeZX');

let INDEX_YZ = 0;
let INDEX_ZX = 1;
let INDEX_XY = 2;
let INDEX_W = 3;
let INDEX_A = 0;
let INDEX_B = 1;
let INDEX_C = 2;
/**
 * Functional constructor for producing a Rotor3.
 * The function is named so as to avoid case-insensitive collisions with Rotor3.
 * This will be exposed as `rotor3`.
 * We only need 2 parameters because the sum of the squares of the components is 1.
 * Perhaps we should think of the third as being part of a cache?
 * Extending this idea, what if
 */
function rotor3(): Rotor3 {
  // For mutable classes, perhaps no-arg constructors make sense,
  // or maybe we have specialized constructors that maintain a data structure?
  // yz <=> a <=> 0
  // zx <=> b <=> 1
  // xy <=> c <=> 2
  // We choose any kind of data structure to store our state.
  let data: VectorN<number> = new VectorN<number>([0, 0, 0, 1], false, 4);

  let self: Rotor3 = {
    get modified(): boolean {
      return data.modified;
    },
    set modified(value: boolean) {
      data.modified = value;
    },
    get yz(): number {
      return data.getComponent(INDEX_YZ);
    },
    set yz(value: number) {
      data.setComponent(INDEX_YZ, value);
    },
    get zx(): number {
      return data.getComponent(INDEX_ZX);
    },
    set zx(value: number) {
      data.setComponent(INDEX_ZX, value);
    },
    get xy(): number {
      return data.getComponent(INDEX_XY);
    },
    set xy(value: number) {
      data.setComponent(INDEX_XY, value);
    },
    get w(): number {
      return data.getComponent(INDEX_W);
    },
    set w(value: number) {
      data.setComponent(INDEX_W, value);
    },
    copy(spinor: Spinor3Coords): Rotor3 {
      self.w = spinor.w;
      self.yz = spinor.yz;
      self.zx = spinor.zx;
      self.xy = spinor.xy;
      return self;
    },
    exp(): Rotor3 {
      let w  = this.w;
      let yz = this.yz;
      let zx = this.zx;
      let xy = this.xy;
      let expW  = Math.exp(w);
      let B  = Math.sqrt(yz * yz + zx * zx + xy * xy);
      let s  = expW * (B !== 0 ? Math.sin(B) / B : 1);
      this.w  = expW * Math.cos(B);
      this.yz = yz * s;
      this.zx = zx * s;
      this.xy = xy * s;
      return this;
    },
    multiply(spinor: Spinor3Coords): Rotor3 {
      return self.product(self, spinor);
    },
    multiplyScalar(s: number): Rotor3 {
      self.w  *= s;
      self.yz *= s;
      self.zx *= s;
      self.xy *= s;
      return self;
    },
    product(n: Spinor3Coords, m: Spinor3Coords): Rotor3 {
      let n0 = n.w;
      let n1 = n.yz;
      let n2 = n.zx;
      let n3 = n.xy;
      let m0 = m.w;
      let m1 = m.yz;
      let m2 = m.zx;
      let m3 = m.xy;
      // TODO; We are assuming that the inputs are unit vectors!
      let W = n0 * m0 - n1 * m1 - n2 * m2 - n3 * m3;
      let A = n0 * m1 + n1 * m0 - n2 * m3 + n3 * m2;
      let B = n0 * m2 + n1 * m3 + n2 * m0 - n3 * m1;
      let C = n0 * m3 - n1 * m2 + n2 * m1 + n3 * m0;
      let magnitude = Math.sqrt(W * W + A * A + B * B + C * C);
      self.w = W / magnitude;
      self.yz = A / magnitude;
      self.zx = B / magnitude;
      self.xy = C / magnitude;
      return self;
    },
    reverse(): Rotor3 {
      self.yz *= -1;
      self.zx *= -1;
      self.xy *= -1;
      return self;
    },
    toString(): string {
      return ['Rotor3 => ', JSON.stringify({ yz: self.yz, zx: self.zx, xy: self.xy, w: self.w })].join('');
    },
    wedgeVectors(a: Cartesian3, b: Cartesian3): Rotor3 {
      let ax = a.x, ay = a.y, az = a.z;
      let bx = b.x, by = b.y, bz = b.z;

      this.w = 0;
      this.yz = wedgeYZ(ax, ay, az, bx, by, bz);
      this.zx = wedgeZX(ax, ay, az, bx, by, bz);
      this.xy = wedgeXY(ax, ay, az, bx, by, bz);

      return this;
    }
  };
  return self;
}

export = rotor3;