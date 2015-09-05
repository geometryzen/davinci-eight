import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');

class AbstractMatrix implements Mutable<Float32Array> {
  private _data: Float32Array;
  private _callback: () => Float32Array;
  private _length: number;
  public modified: boolean;
  constructor(data: Float32Array, length: number) {
    expectArg('data', data).toSatisfy(data.length === length, 'data must have length ' + length);
    this._data = data;
    this._length = length;
    this.modified = false;
  }
  get data() {
    if (this._data) {
      return this._data;
    }
    else if (this._callback) {
      var data = this._callback();
      expectArg('callback()', data).toSatisfy(data.length === this._length, "callback() length must be " + this._length);
      return this._callback();
    }
    else {
      throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
    }
  }
  set data(data: Float32Array) {
    expectArg('data', data).toSatisfy(data.length === this._length, "data length must be " + this._length);
    this._data = data;
    this._callback = void 0;
  }
  get callback() {
    return this._callback;
  }
  set callback(reactTo: () => Float32Array) {
    this._callback = reactTo;
    this._data = void 0;
  }
}

export = AbstractMatrix;