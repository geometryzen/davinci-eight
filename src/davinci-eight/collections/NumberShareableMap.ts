import incLevel from '../base/incLevel';
import Shareable from '../core/Shareable';
import ShareableBase from '../core/ShareableBase';

/**
 * @module EIGHT
 * @submodule collections
 */

/**
 * @class NumberShareableMap
 * @extends ShareableBase
 */
export default class NumberShareableMap<V extends Shareable> extends ShareableBase {

  /**
   * @property _elements
   * @private
   */
  private _elements: { [key: number]: V } = {};

  /**
   * @class NumberShareableMap
   * @constructor
   * @param [level = 0] {number}
   */
  constructor(level = 0) {
    super('NumberShareableMap', incLevel(level))
  }

  /**
   * @property destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    this.forEach(function(key, value) {
      if (value) {
        value.release()
      }
    });
    this._elements = void 0
    super.destructor(incLevel(level))
  }

  /**
   * @method exists
   * @param {number}
   * @return {boolean}
   */
  exists(key: number): boolean {
    let element = this._elements[key]
    return element ? true : false
  }

  /**
   * @method get
   * @param key {number}
   * @return {V}
   */
  get(key: number): V {
    let element = this.getWeakRef(key)
    if (element) {
      element.addRef()
    }
    return element
  }

  /**
   * @method getWeakRef
   * @param key {number}
   * @return {V}
   */
  getWeakRef(index: number): V {
    return this._elements[index]
  }

  /**
   * @method put
   * @param key {number}
   * @param value {V}
   * @return {void}
   */
  put(key: number, value: V): void {
    if (value) {
      value.addRef()
    }
    this.putWeakRef(key, value)
  }

  /**
   * @method putWeakRef
   * @param key {number}
   * @param value {V}
   * @return {void}
   */
  putWeakRef(key: number, value: V): void {
    var elements = this._elements
    var existing = elements[key]
    if (existing) {
      existing.release()
    }
    elements[key] = value
  }

  /**
   * @method forEach
   * @param callback {(key: number, value: V) => void}
   * @return {void}
   */
  forEach(callback: (key: number, value: V) => void) {
    let keys: number[] = this.keys
    for (var i = 0, iLength = keys.length; i < iLength; i++) {
      let key: number = keys[i]
      let value = this._elements[key]
      callback(key, value)
    }
  }

  /**
   * @property keys
   * @type {number[]}
   */
  get keys(): number[] {
    // FIXME: cache? Maybe, clients may use this to iterate. forEach is too slow.
    return Object.keys(this._elements).map(function(keyString) { return parseFloat(keyString) })
  }

  /**
   * @method remove
   * @param key {number}
   * @return {void}
   */
  remove(key: number): void {
    // Strong or Weak doesn't matter because the value is `undefined`.
    this.put(key, void 0)
    delete this._elements[key]
  }
}
