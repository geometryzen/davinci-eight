class BufferAttribute {
  private array: Float32Array;
  private itemSize: number;
  constructor(array: Float32Array, itemSize: number) {
    this.array = array;
    this.itemSize = itemSize;
  }
  get length(): number {
    return this.array.length;
  }
  copyAt(index1: number, attribute: BufferAttribute, index2: number): BufferAttribute {
    index1 *= this.itemSize;
    index2 *= attribute.itemSize;
    for ( var i = 0, l = this.itemSize; i < l; i ++ ) {
      this.array[ index1 + i ] = attribute.array[ index2 + i ];
    }
    return this;
  }
  set(value: number, offset: number): BufferAttribute {
    if ( offset === undefined ) offset = 0;
    this.array.set( value, offset );
    return this;
  }
  setX(index: number, x: number) {
    this.array[index * this.itemSize] = x;
    return this;
  }
  setY( index, y ) {
    this.array[ index * this.itemSize + 1 ] = y;
    return this;
  }
  setZ( index, z ) {
    this.array[ index * this.itemSize + 2 ] = z;
    return this;
  }
  setXY( index, x, y ) {
    index *= this.itemSize;
    this.array[ index     ] = x;
    this.array[ index + 1 ] = y;
    return this;
  }
  setXYZ( index, x, y, z ) {
    index *= this.itemSize;
    this.array[ index     ] = x;
    this.array[ index + 1 ] = y;
    this.array[ index + 2 ] = z;
    return this;
  }
  setXYZW(index: number, x: number, y: number, z: number, w: number): BufferAttribute {
    index *= this.itemSize;
    this.array[ index     ] = x;
    this.array[ index + 1 ] = y;
    this.array[ index + 2 ] = z;
    this.array[ index + 3 ] = w;
    return this;
  }
  clone() {
    return new BufferAttribute(new Float32Array(this.array), this.itemSize);
  }
}

export = BufferAttribute;
