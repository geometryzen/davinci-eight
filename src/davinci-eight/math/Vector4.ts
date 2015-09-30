import Cartesian4 = require('../math/Cartesian4');
import LinearElement = require('../math/LinearElement');
import expectArg = require('../checks/expectArg');
import Spinor4Coords = require('../math/Spinor4Coords');
import VectorN = require('../math/VectorN');

/**
 * @class Vector4
 */
class Vector4 extends VectorN<number> implements Cartesian4, LinearElement<Cartesian4, Vector4, Spinor4Coords, Cartesian4> {
  /**
   * @class Vector4
   * @constructor
   * @param data {number[]} Default is [0, 0, 0, 0].
   * @param modified {boolean} Default is false.
   */
  constructor(data = [0, 0, 0, 0], modified = false) {
    super(data, modified, 4);
  }
  /**
   * @property x
   * @type Number
   */
  get x(): number {
    return this.data[0];
  }
  set x(value: number) {
    this.modified = this.modified || this.x !== value;
    this.data[0] = value;
  }
  setX(x: number) {
    this.x = x;
    return this;
  }
  /**
   * @property y
   * @type Number
   */
  get y(): number {
    return this.data[1];
  }
  set y(value: number) {
    this.modified = this.modified || this.y !== value;
    this.data[1] = value;
  }
  setY(y: number) {
    this.y = y;
    return this;
  }
  /**
   * @property z
   * @type Number
   */
  get z(): number {
    return this.data[2];
  }
  set z(value: number) {
    this.modified = this.modified || this.z !== value;
    this.data[2] = value;
  }
  setZ(z: number) {
    this.z = z;
    return this;
  }
  /**
   * @property w
   * @type Number
   */
  get w(): number {
    return this.data[3];
  }
  set w(value: number) {
    this.modified = this.modified || this.w !== value;
    this.data[3] = value;
  }
  setW(w: number) {
    this.w = w;
    return this;
  }
  add(rhs: Cartesian4) {
    return this;
  }
  sum(a: Cartesian4, b: Cartesian4) {
    return this;
  }
  clone() {
    return new Vector4([this.x, this.y, this.z, this.w]);
  }
  copy(v: Cartesian4) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }
  divideScalar(scalar: number) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    this.w /= scalar;
    return this;
  }
  lerp(target: Cartesian4, alpha: number) {
    this.x += ( target.x - this.x ) * alpha;
    this.y += ( target.y - this.y ) * alpha;
    this.z += ( target.z - this.z ) * alpha;
    this.w += ( target.w - this.w ) * alpha;
    return this;
  }
  scale(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }
  reflect(n: Cartesian4) {
    return this;
  }
  rotate(rotor: Spinor4Coords) {
    return this;
  }
  sub(rhs: Cartesian4) {
    return this;
  }
  difference(a: Cartesian4, b: Cartesian4) {
    return this;
  }
}

export = Vector4;