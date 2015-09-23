import IUnknown = require('../core/IUnknown')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import uuid4 = require('../utils/uuid4')

let LOGGING_NAME_IUNKNOWN_MAP = 'StringIUnknownMap'

class StringIUnknownMap<V extends IUnknown> implements IUnknown {
  private _refCount = 1;
  private _elements: { [key: string]: V } = {};
  private _uuid = uuid4().generate();
  /**
   * <p>
   * A map&lt;V&gt; of <code>string</code> to <code>V extends IUnknown</code>.
   * </p>
   * @class StringIUnknownMap
   * @constructor
   */
  constructor() {
    refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, +1);
  }
  addRef() {
    refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, +1);
    this._refCount++;
    return this._refCount;
  }
  release() {
    refChange(this._uuid, LOGGING_NAME_IUNKNOWN_MAP, -1);
    this._refCount--;
    if (this._refCount === 0) {
      let self = this;
      this.forEach(function(key) {
        self.putWeakReference(key, void 0);
      });
      this._elements = void 0;
    }
    return this._refCount;
  }
  /**
   * Determines whether the key exists in the map with a defined value.
   * @method exists
   * @param key {string}
   * @return {boolean} <p><code>true</code> if there is an element at the specified key.</p>
   */
  exists(key: string): boolean {
    let element = this._elements[key];
    return element ? true : false;
  }
  getStrongReference(key: string): V {
    let element = this._elements[key];
    if (element) {
      element.addRef();
      return element;
    }
    else {
      return void 0;
    }
  }
  getWeakReference(key: string): V {
    let element = this._elements[key];
    if (element) {
      return element;
    }
    else {
      return void 0;
    }
  }
  putStrongReference(key: string, value: V): void {
    if (value) {
      value.addRef()
    }
    this.putWeakReference(key, value)
  }
  putWeakReference(key: string, value: V): void {
    var elements = this._elements
    var existing = elements[key]
    if (existing) {
      existing.release()
    }
    elements[key] = value
  }
  forEach(callback: (key: string, value: V) => void) {
    let keys: string[] = this.keys;
    var i: number;
    let length: number = keys.length;
    for (i = 0; i < length; i++) {
      let key: string = keys[i];
      let value = this._elements[key];
      callback(key, value);
    }
  }
  get keys(): string[] {
    // TODO: memoize
    return Object.keys(this._elements);
  }
  remove(key: string) {
    var value = this.getWeakReference(key)
    if (value) {
      value.release()
    }
    delete this._elements[key]
  }
}

export = StringIUnknownMap;