import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');

class AbstractVector implements Mutable<number[]> {
  private _data: number[];
  private _callback: () => number[];
  private _size: number;
  public modified: boolean;
  constructor(data: number[], size: number) {
    this._data = data;
    this._size = size;
    this.modified = false;
  }
  get data() {
    if (this._data) {
      return this._data;
    }
    else if (this._callback) {
      var data = this._callback();
      expectArg('callback()', data).toSatisfy(data.length === this._size, "callback() length must be " + this._size);
      return this._callback();
    }
    else {
      throw new Error("Vector" + this._size + " is undefined.");
    }
  }
  set data(data: number[]) {
    expectArg('data', data).toSatisfy(data.length === this._size, "data length must be " + this._size);
    this._data = data;
    this._callback = void 0;
  }
  get callback() {
    return this._callback;
  }
  set callback(reactTo: () => number[]) {
    this._callback = reactTo;
    this._data = void 0;
  }
}

export = AbstractVector;