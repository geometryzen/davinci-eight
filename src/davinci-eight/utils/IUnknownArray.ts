import IUnknown = require('../core/IUnknown');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');

let LOGGING_NAME = 'IUnknownArray';

class IUnknownArray<T extends IUnknown> implements IUnknown {
  private _elements: T[] = [];
  private _refCount = 1;
  private _uuid = uuid4().generate();
  constructor() {
   refChange(this._uuid, LOGGING_NAME, +1);
  }
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, LOGGING_NAME, +1);
    return this._refCount;
  }
  indexOf(element: T): number {
    return this._elements.indexOf(element);
  }
  get length() {
    return this._elements.length;
  }
  release(): number {
    this._refCount--;
    refChange(this._uuid, LOGGING_NAME, -1);
    if (this._refCount === 0) {
      for (var i = 0, l = this._elements.length; i < l; i++) {
        this._elements[i].release();
      }
      this._elements = void 0;
      this._refCount = void 0;
      this._uuid = void 0;
      return 0;
    }
    else {
      return this._refCount;
    }
  }
  splice(index: number, count: number) {
    // The release burdon is on the caller now.
    return this._elements.splice(index, count);
  }
  /**
   * Traverse without Reference Counting
   */
  forEach(callback: (value: T, index: number) => void) {
    this._elements.forEach(callback);
  }
  push(element: T) {
    this._elements.push(element);
    element.addRef();
  }
  pop() {
    return this._elements.pop();
  }
}

export = IUnknownArray;