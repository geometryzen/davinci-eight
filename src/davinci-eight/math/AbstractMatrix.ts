import mustBeInteger = require('../checks/mustBeInteger')
import Mutable = require('../math/Mutable')
import expectArg = require('../checks/expectArg')

/**
 * @class AbstractMatrix
 */
class AbstractMatrix implements Mutable<Float32Array> {
  private _data: Float32Array;
  private _callback: () => Float32Array;
  private _length: number;
  private _dimensions: number;
  public modified: boolean;
  /**
   * @class AbstractMatrix
   * @constructor
   * @param data {Float32Array}
   * @param dimensions {number}
   */
  constructor(data: Float32Array, dimensions: number) {
    this._dimensions = mustBeInteger('dimensions', dimensions)
    this._length = dimensions * dimensions;
    expectArg('data', data).toSatisfy(data.length === this._length, 'data must have length ' + this._length);
    this._data = data;
    this.modified = false;
  }
  /**
   * @property data
   * @type {Float32Array}
   */
  get data(): Float32Array {
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
  /**
   * @property callback
   * @type {() => Float32Array}
   */
  get callback() {
    return this._callback;
  }
  set callback(reactTo: () => Float32Array) {
    this._callback = reactTo;
    this._data = void 0;
  }
  /**
   * @property dimensions
   * @type {number}
   * @readOnly
   */
  get dimensions(): number {
    return this._dimensions
  }
}

export = AbstractMatrix;