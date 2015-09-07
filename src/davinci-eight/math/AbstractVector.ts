import Mutable = require('../math/Mutable');
import expectArg = require('../checks/expectArg');

class AbstractVector implements Mutable<number[]> {
  private _size: number;
  private _data: number[];
  private _callback: () => number[];
  public modified: boolean;
  constructor(data: number[], size: number, modified: boolean = false) {
    this._size    = expectArg('size', size).toBeNumber().toSatisfy(size >= 0, "size must be positive").value;
    this._data    = expectArg('data', data).toBeObject().toSatisfy(data.length === size, "data length must be " + size).value;
    this.modified = expectArg('modified', modified).toBeBoolean().value;
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