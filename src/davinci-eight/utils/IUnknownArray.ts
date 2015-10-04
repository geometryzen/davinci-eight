import IUnknown = require('../core/IUnknown')
import Shareable = require('../utils/Shareable')

let LOGGING_NAME = 'IUnknownArray';

/**
 * @class IUnknownArray
 */
class IUnknownArray<T extends IUnknown> extends Shareable {
    private _elements: T[];
  /**
   * Collection class for maintaining an array of types derived from IUnknown.
   * Provides a safer way to maintain reference counts than a native array.
   * @class IUnknownArray
   * @constructor
   */
  constructor(elements: T[] = []) {
   super(LOGGING_NAME)
   this._elements = elements
    for (var i = 0, l = this._elements.length; i < l; i++) {
      this._elements[i].addRef()
    }
  }
  /**
   * @method destructor
   * @return {void}
   */
  protected destructor(): void {
    for (var i = 0, l = this._elements.length; i < l; i++) {
      this._elements[i].release()
    }
    this._elements = void 0;
  }
  /**
   * Gets the element at the specified index, incrementing the reference count.
   * @method get
   * @param index {number}
   * @return {T}
   */
  get(index: number): T {
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
  get length(): number {
    return this._elements.length;
  }
  slice(start?: number, end?: number): IUnknownArray<T> {
    return new IUnknownArray(this._elements.slice(start, end))
  }
  /**
   * @method splice
   * @param index {number}
   * @param count {number}
   * @return {IUnnownArray<T>}
   */
  splice(index: number, count: number): IUnknownArray<T> {
    // The release burdon is on the caller now.
    // FIXME: This should return another IUnknownArray
    return new IUnknownArray(this._elements.splice(index, count))
  }
  /**
   * @method shift
   * @return {T}
   */
  shift(): T {
    // No need to addRef because ownership is being transferred to caller.
    return this._elements.shift()
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
   * Pushes an element onto the tail of the list and increments the element reference count.
   * @method push
   * @param element {T}
   * @return {number}
   */
  push(element: T): number {
    var x: number = this._elements.push(element)
    if (element) {
      element.addRef()
    }
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