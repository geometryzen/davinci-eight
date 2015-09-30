import IUnknown = require('../core/IUnknown')
import Shareable = require('../utils/Shareable')

let LOGGING_NAME = 'IUnknownArray';

/**
 * @class IUnknownArray
 */
class IUnknownArray<T extends IUnknown> extends Shareable {
  private _elements: T[] = [];
  /**
   * Collection class for maintaining an array of types derived from IUnknown.
   * Provides a safer way to maintain reference counts than a native array.
   * @class IUnknownArray
   * @constructor
   */
  constructor() {
   super(LOGGING_NAME)
  }
  /**
   * @method destructor
   * @return {void}
   */
  protected destructor(): void {
    for (var i = 0, l = this._elements.length; i < l; i++) {
      this._elements[i].release();
    }
    this._elements = void 0;
  }
  /**
   * Gets the element at the specified index without incrementing the reference count.
   * Use this method when you don't intend to hold onto the returned value.
   * @method getWeakReference
   * @param index {number}
   * @return {T}
   */
  getWeakReference(index: number): T {
    return this._elements[index];
  }
  /**
   * Gets the element at the specified index, incrementing the reference count.
   * Use this method when you intend to hold onto the referent and release it later.
   * @method getStrongReference
   * @param index {number}
   * @return {T}
   */
  getStrongReference(index: number): T {
    var element: T
    element = this._elements[index]
    if (element) {
      element.addRef()
    }
    return element
  }
  /**
   * @method indexOf
   * @param searchElement {T}
   * @param [fromIndex]
   * @return {number}
   */
  indexOf(searchElement: T, fromIndex?: number): number {
    return this._elements.indexOf(searchElement, fromIndex);
  }
  /**
   * @property length
   * @return {number}
   */
  get length() {
    return this._elements.length;
  }
  splice(index: number, count: number): T[] {
    // The release burdon is on the caller now.
    // FIXME: This should return another IUnknownArray
    return this._elements.splice(index, count);
  }
  /**
   * Traverse without Reference Counting
   * @method forEach
   * @param callback {(value: T, index: number)=>void}
   * @return {void}
   */
  forEach(callback: (value: T, index: number) => void): void {
    return this._elements.forEach(callback);
  }
  /**
   * @method push
   * @param element {T}
   * @return {number}
   */
  push(element: T): number {
    var x: number = this._elements.push(element)
    element.addRef()
    return x
  }
  /**
   * @method pop
   * @return {T}
   */
  pop(): T {
    // No need to addRef because ownership is being transferred to caller.
    return this._elements.pop()
  }
}

export = IUnknownArray;