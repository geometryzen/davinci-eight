import IUnknown = require('../core/IUnknown')
import mustBeString = require('../checks/mustBeString')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import uuid4 = require('../utils/uuid4')

function className(user: string) {
  var LOGGING_NAME_IUNKNOWN_MAP = 'StringIUnknownMap'
  return LOGGING_NAME_IUNKNOWN_MAP + ":" + user
}

/**
 * @class StringIUnknownMap<V extends IUnknown>
 * @extends IUnknown
 */
// FIXME: Extend Shareable
class StringIUnknownMap<V extends IUnknown> implements IUnknown {
  private _refCount = 1;
  private _elements: { [key: string]: V } = {};
  private _uuid = uuid4().generate();
  private _userName: string
  /**
   * <p>
   * A map&lt;V&gt; of <code>string</code> to <code>V extends IUnknown</code>.
   * </p>
   * @class StringIUnknownMap
   * @constructor
   */
  constructor(userName: string) {
    this._userName = userName
    refChange(this._uuid, className(this._userName), +1);
  }
  addRef() {
    refChange(this._uuid, className(this._userName), +1);
    this._refCount++;
    return this._refCount;
  }
  release() {
    refChange(this._uuid, className(this._userName), -1);
    this._refCount--;
    if (this._refCount === 0) {
      let self = this;
      this.forEach(function(key) {
        self.putWeakRef(key, void 0);
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
  get(key: string): V {
    let element = this._elements[key];
    if (element) {
      element.addRef();
      return element;
    }
    else {
      return void 0;
    }
  }
  getWeakRef(key: string): V {
    return this._elements[key];
  }
  put(key: string, value: V): void {
    if (value) {
      value.addRef()
    }
    this.putWeakRef(key, value)
  }
  /**
   * @method putWeakRef
   * @param key {string}
   * @param value {V}
   * @return {void}
   * @private
   */
  public putWeakRef(key: string, value: V): void {
    mustBeString('key', key)
    var elements = this._elements
    var existing = elements[key]
    if (existing) {
      existing.release()
    }
    elements[key] = value
  }
  forEach(callback: (key: string, value: V) => void) {
    let keys: string[] = this.keys;
    for (var i = 0, iLength = keys.length; i < iLength; i++) {
      let key: string = keys[i];
      callback(key, this._elements[key]);
    }
  }
  get keys(): string[] {
    // TODO: Cache
    return Object.keys(this._elements);
  }
  get values(): V[] {
    // TODO: Cache
    var values: V[] = []
    var keys: string[] = this.keys
    for (var i = 0, iLength = keys.length; i < iLength; i++) {
      let key: string = keys[i]
      values.push(this._elements[key])
    }
    return values
  }
  remove(key: string): V {
    var value = this._elements[key]
    delete this._elements[key]
    return value
  }
}

export = StringIUnknownMap;
