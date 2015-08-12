import Cartesian2 = require('../math/Cartesian2');
import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');

/**
 * @class Vector2
 */
class Vector2 implements Cartesian2, Mutable<number[]> {
  private $data: number[];
  private $callback: () => number[];
  public modified: boolean;
  /**
   * @class Vector2
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
      expectArg('callback()', data).toSatisfy(data.length === 2, "callback() length must be 2");
      return this.$callback();
    }
    else {
      throw new Error("Vector2 is undefined.");
    }
  }
  set data(data: number[]) {
    expectArg('data', data).toSatisfy(data.length === 2, "data length must be 2");
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
  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }
  setX(x: number) {
    this.x = x;
    return this;
  }
  setY(y: number) {
    this.y = y;
    return this;
  }
  setComponent(index: number, value: number) {
    switch ( index ) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      default: throw new Error( 'index is out of range: ' + index );
    }
  }
  getComponent(index: number) {
    switch ( index ) {
      case 0: return this.x;
      case 1: return this.y;
      default: throw new Error( 'index is out of range: ' + index );
    }
  }
  copy(v: Cartesian2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  add(v: Cartesian2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  addScalar(s: number) {
    this.x += s;
    this.y += s;
    return this;
  }
  addVectors(a: Cartesian2, b: Cartesian2) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }
  sub(v: Cartesian2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  subScalar(s: number) {
    this.x -= s;
    this.y -= s;
    return this;
  }
  subVectors(a: Cartesian2, b: Cartesian2) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }
  multiply(v: Cartesian2) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  multiplyScalar(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  divide(v: Cartesian2) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }
  divideScalar(scalar: number) {
    if ( scalar !== 0 ) {
      var invScalar = 1 / scalar;
      this.x *= invScalar;
      this.y *= invScalar;
    }
    else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }
  min(v: Cartesian2) {
    if ( this.x > v.x ) {
      this.x = v.x;
    }
    if ( this.y > v.y ) {
      this.y = v.y;
    }
    return this;
  }
  max(v: Cartesian2) {
    if ( this.x < v.x ) {
      this.x = v.x;
    }
    if ( this.y < v.y ) {
      this.y = v.y;
    }
    return this;
  }
  floor() {
    this.x = Math.floor( this.x );
    this.y = Math.floor( this.y );
    return this;
  }
  ceil() {
    this.x = Math.ceil( this.x );
    this.y = Math.ceil( this.y );
    return this;
  }
  round() {
    this.x = Math.round( this.x );
    this.y = Math.round( this.y );
    return this;
  }
  roundToZero() {
    this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
    this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
    return this;
  }
  negate() {
    this.x = - this.x;
    this.y = - this.y;
    return this;
  }
  distanceTo(position: Cartesian2) {
    return Math.sqrt( this.quadranceTo(position));
  }
  dot(v: Cartesian2) {
    return this.x * v.x + this.y * v.y;
  }
  magnitude(): number {
    return Math.sqrt(this.quaditude());
  }
  normalize() {
    return this.divideScalar(this.magnitude());
  }
  quaditude(): number {
    return this.x * this.x + this.y * this.y;
  }
  quadranceTo(position: Cartesian2) {
    let dx = this.x - position.x;
    let dy = this.y - position.y;
    return dx * dx + dy * dy;
  }
  setMagnitude(l: number) {
    var oldLength = this.magnitude();
    if ( oldLength !== 0 && l !== oldLength ) {
      this.multiplyScalar( l / oldLength );
    }
    return this;
  }
  lerp(v: Cartesian2, alpha: number) {
    this.x += ( v.x - this.x ) * alpha;
    this.y += ( v.y - this.y ) * alpha;
    return this;
  }
  lerpVectors(v1: Vector2, v2: Vector2, alpha: number) {
    this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );
    return this;
  }
  equals(v: Cartesian2) {
    return ( ( v.x === this.x ) && ( v.y === this.y ) );
  }
  fromArray(array: number[], offset: number) {
    if ( offset === undefined ) offset = 0;
    this.x = array[ offset ];
    this.y = array[ offset + 1 ];
    return this;
  }
  toArray(array: number[], offset: number) {
    if ( array === undefined ) array = [];
    if ( offset === undefined ) offset = 0;
    array[ offset ] = this.x;
    array[ offset + 1 ] = this.y;
    return array;
  }
  fromAttribute(attribute: {itemSize: number, array: number[]}, index: number, offset: number) {
    if ( offset === undefined ) offset = 0;
    index = index * attribute.itemSize + offset;
    this.x = attribute.array[ index ];
    this.y = attribute.array[ index + 1 ];
    return this;
  }
  clone() {
    return new Vector2([this.x, this.y]);
  }
}

export = Vector2;
