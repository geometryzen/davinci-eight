class Vector2 {
  public x: number;
  public y: number;
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
  set(x: number, y: number) {
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
  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  addScalar(s: number) {
    this.x += s;
    this.y += s;
    return this;
  }
  addVectors(a: Vector2, b: Vector2) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }
  sub(v: Vector2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  subScalar(s: number) {
    this.x -= s;
    this.y -= s;
    return this;
  }
  subVectors(a: Vector2, b: Vector2) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }
  multiply(v: Vector2) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  multiplyScalar(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  divide(v: Vector2) {
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
  min(v: Vector2) {
    if ( this.x > v.x ) {
      this.x = v.x;
    }
    if ( this.y > v.y ) {
      this.y = v.y;
    }
    return this;
  }
  max(v: Vector2) {
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
  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length(): number {
    return Math.sqrt( this.x * this.x + this.y * this.y );
  }
  normalize() {
    return this.divideScalar( this.length() );
  }
  distanceTo(v: Vector2) {
    return Math.sqrt( this.distanceToSquared( v ) );
  }
  distanceToSquared(v: Vector2) {
    var dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;
  }
  setLength(l: number) {
    var oldLength = this.length();
    if ( oldLength !== 0 && l !== oldLength ) {
      this.multiplyScalar( l / oldLength );
    }
    return this;
  }
  lerp(v: Vector2, alpha: number) {
    this.x += ( v.x - this.x ) * alpha;
    this.y += ( v.y - this.y ) * alpha;
    return this;
  }
  lerpVectors(v1: Vector2, v2: Vector2, alpha: number) {
    this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );
    return this;
  }
  equals(v: Vector2) {
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
    return new Vector2(this.x, this.y);
  }
}

export = Vector2;
