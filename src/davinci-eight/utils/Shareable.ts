import mustBeString = require('../checks/mustBeString');
import refChange = require('../utils/refChange');
import IUnknown = require('../core/IUnknown');
import uuid4 = require('../utils/uuid4');

/**
 * <p>
 * Convenient base class for derived classes implementing IUnknown.
 * </p>
 *
 * @class Shareable
 * @implements IUnknown
 */
class Shareable implements IUnknown {
  private _refCount: number = 1;
  private _type: string;
  private _uuid = uuid4().generate();
  /**
   * @class Shareable
   * @constructor
   * @param type {string} The human-readable name of the derived type.
   */
  constructor(type: string) {
    this._type = mustBeString('type', type);
    refChange(this._uuid, type, +1);
  }
  /**
   * Notifies this instance that something is dereferencing it.
   *
   * @method addRef
   * @return {number} The new value of the reference count.
   */
  addRef(): number {
    this._refCount++;
    refChange(this._uuid, this._type, +1);
    return this._refCount;
  }
  /**
   * Notifies this instance that something is referencing it.
   *
   * @method release
   * @return {number} The new value of the reference count.
   */
  release(): number {
    this._refCount--;
    refChange(this._uuid, this._type, -1);
    let refCount = this._refCount;
    if (refCount === 0) {
      this.destructor();
      this._refCount = void 0;
      this._type = void 0;
      this._uuid = void 0;
    }
    return refCount;
  }
  /**
   * This method should be implemented by derived classes.
   *
   * @method destructor
   * @return {void}
   */
  protected destructor(): void {
    console.warn("`destructor(): void` method should be implemented by `" + this._type + "`.");
  }
}

export = Shareable;