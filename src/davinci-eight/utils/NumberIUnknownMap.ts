import IUnknown = require('../core/IUnknown');
import refChange = require('../utils/refChange');
import uuid4 = require('../utils/uuid4');

// FIXME: Maybe use a dynamic flag implying JIT keys, otherwise recompute as we go along.

let LOGGING_NAME = 'NumberIUnknownMap';

class NumberIUnknownMap<V extends IUnknown> implements IUnknown {
  private _refCount = 1;
  private _elements: { [key: number]: V } = {};
  private _uuid = uuid4().generate();
  constructor() {
    refChange(this._uuid, LOGGING_NAME, +1);
  }
  addRef() {
    refChange(this._uuid, LOGGING_NAME, +1);
    this._refCount++;
    return this._refCount;
  }
  release() {
    refChange(this._uuid, LOGGING_NAME, -1);
    this._refCount--;
    if (this._refCount === 0) {
      let self = this;
      this.forEach(function(key) {
        self.putStrongReference(key, void 0);
      });
      this._elements = void 0;
    }
    return this._refCount;
  }
  exists(key: number): boolean {
    let element = this._elements[key];
    return element ? true : false;
  }
  getStrongReference(key: number): V {
    let element = this.getWeakReference(key)
    if (element) {
      element.addRef()
    }
    return element;
  }
  getWeakReference(index: number): V {
    return this._elements[index]
  }
  putStrongReference(key: number, value: V): void {
    if (value) {
      value.addRef()
    }
    this.putWeakReference(key, value)
  }
  putWeakReference(key: number, value: V): void {
    var elements = this._elements
    var existing = elements[key]
    if (existing) {
      existing.release()
    }
    elements[key] = value
  }
  forEach(callback: (key: number, value: V) => void) {
    let keys: number[] = this.keys;
    var i: number;
    let length: number = keys.length;
    for (i = 0; i < length; i++) {
      let key: number = keys[i];
      let value = this._elements[key];
      callback(key, value);
    }
  }
  get keys(): number[] {
    // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
    return Object.keys(this._elements).map(function(keyString){return parseFloat(keyString)});
  }
  remove(key: number) {
    // Strong or Weak doesn't matter because the value is `undefined`.
    this.putStrongReference(key, void 0);
    delete this._elements[key];
  }
}

export = NumberIUnknownMap;