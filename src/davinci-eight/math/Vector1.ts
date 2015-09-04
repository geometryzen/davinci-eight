import Cartesian1 = require('../math/Cartesian1');
import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');

/**
 * @class Vector1
 */
class Vector1 implements Cartesian1, Mutable<number[]> {
  private $data: number[];
  private $callback: () => number[];
  public modified: boolean;
  /**
   * @class Vector1
   * @constructor
   * @param data {number[]}
   */
  constructor(data: number[] = [0, 0]) {
    this.data = data;
    this.modified = false;
  }
  get data() {
    if (this.$data) {
      return this.$data;
    }
    else if (this.$callback) {
      var data = this.$callback();
      expectArg('callback()', data).toSatisfy(data.length === 1, "callback() length must be 1");
      return this.$callback();
    }
    else {
      throw new Error("Vector1 is undefined.");
    }
  }
  set data(data: number[]) {
    expectArg('data', data).toSatisfy(data.length === 1, "data length must be 1");
    this.$data = data;
    this.$callback = void 0;
  }
  get callback() {
    return this.$callback;
  }
  set callback(reactTo: () => number[]) {
    this.$callback = reactTo;
    this.$data = void 0;
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
  set(x: number): Vector1 {
    this.x = x;
    return this;
  }
  setX(x: number) {
    this.x = x;
    return this;
  }
  setComponent(index: number, value: number) {
    switch ( index ) {
      case 0: this.x = value; break;
      default: throw new Error( 'index is out of range: ' + index );
    }
  }
  getComponent(index: number) {
    switch ( index ) {
      case 0: return this.x;
      default: throw new Error( 'index is out of range: ' + index );
    }
  }
  copy(v: Cartesian1) {
    this.x = v.x;
    return this;
  }
  add(v: Cartesian1) {
    this.x += v.x;
    return this;
  }
  addScalar(s: number) {
    this.x += s;
    return this;
  }
  addVectors(a: Cartesian1, b: Cartesian1) {
    this.x = a.x + b.x;
    return this;
  }
  sub(v: Cartesian1) {
    this.x -= v.x;
    return this;
  }
  subScalar(s: number) {
    this.x -= s;
    return this;
  }
  subVectors(a: Cartesian1, b: Cartesian1) {
    this.x = a.x - b.x;
    return this;
  }
  multiply(v: Cartesian1) {
    this.x *= v.x;
    return this;
  }
  multiplyScalar(s: number) {
    this.x *= s;
    return this;
  }
  divide(v: Cartesian1) {
    this.x /= v.x;
    return this;
  }
  divideScalar(scalar: number) {
    if ( scalar !== 0 ) {
      var invScalar = 1 / scalar;
      this.x *= invScalar;
    }
    else {
      this.x = 0;
    }
    return this;
  }
  min(v: Cartesian1) {
    if ( this.x > v.x ) {
      this.x = v.x;
    }
    return this;
  }
  max(v: Cartesian1) {
    if ( this.x < v.x ) {
      this.x = v.x;
    }
    return this;
  }
  floor() {
    this.x = Math.floor( this.x );
    return this;
  }
  ceil() {
    this.x = Math.ceil( this.x );
    return this;
  }
  round() {
    this.x = Math.round( this.x );
    return this;
  }
  roundToZero() {
    this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
    return this;
  }
  negate() {
    this.x = - this.x;
    return this;
  }
  distanceTo(position: Cartesian1) {
    return Math.sqrt( this.quadranceTo(position));
  }
  dot(v: Cartesian1) {
    return this.x * v.x;
  }
  magnitude(): number {
    return Math.sqrt(this.quaditude());
  }
  normalize() {
    return this.divideScalar(this.magnitude());
  }
  quaditude(): number {
    return this.x * this.x;
  }
  quadranceTo(position: Cartesian1) {
    let dx = this.x - position.x;
    return dx * dx;
  }
  setMagnitude(l: number) {
    var oldLength = this.magnitude();
    if ( oldLength !== 0 && l !== oldLength ) {
      this.multiplyScalar( l / oldLength );
    }
    return this;
  }
  lerp(v: Cartesian1, alpha: number) {
    this.x += ( v.x - this.x ) * alpha;
    return this;
  }
  lerpVectors(v1: Vector1, v2: Vector1, alpha: number) {
    this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );
    return this;
  }
  equals(v: Cartesian1) {
    return v.x === this.x;
  }
  fromArray(array: number[], offset: number) {
    if ( offset === undefined ) offset = 0;
    this.x = array[ offset ];
    return this;
  }
  toArray(array: number[], offset: number) {
    if ( array === undefined ) array = [];
    if ( offset === undefined ) offset = 0;
    array[ offset ] = this.x;
    return array;
  }
  fromAttribute(attribute: {itemSize: number, array: number[]}, index: number, offset: number) {
    if ( offset === undefined ) offset = 0;
    index = index * attribute.itemSize + offset;
    this.x = attribute.array[ index ];
    return this;
  }
  clone() {
    return new Vector1([this.x]);
  }
}

export = Vector1;
