import IUnknown = require('../core/IUnknown')
import Shareable = require('../utils/Shareable')

// FIXME: Maybe use a dynamic flag implying JIT keys, otherwise recompute as we go along.

let LOGGING_NAME = 'NumberIUnknownMap';

class NumberIUnknownMap<V extends IUnknown> extends Shareable implements IUnknown {
  private _elements: { [key: number]: V } = {};
  constructor() {
    super(LOGGING_NAME)
  }
  protected destructor(): void {
    let self = this;
    this.forEach(function(key, value) {
      if (value) {
          value.release()
        }
      });
      this._elements = void 0;
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