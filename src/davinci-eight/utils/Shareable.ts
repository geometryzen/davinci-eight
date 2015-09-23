import mustBeString = require('../checks/mustBeString');
import refChange = require('../utils/refChange');
import IUnknown = require('../core/IUnknown');
import uuid4 = require('../utils/uuid4');

class Shareable implements IUnknown {
  private _refCount: number = 1;
  protected _type: string;
  private _uuid = uuid4().generate();
  /**
   * <p>
   * Convenient base class for derived classes implementing <code>IUnknown</code>.
   * </p>
   * @class Shareable
   * @extends IUnknown
   * @constructor
   * @param type {string} The human-readable name of the derived type.
   */
  constructor(type: string) {
    this._type = mustBeString('type', type);
    refChange(this._uuid, type, +1);
  }
  /**
   * <p>
   * Notifies this instance that something is dereferencing it.
   * </p>
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
   * <p>
   * Notifies this instance that something is dereferencing it.
   * </p>
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
   * <p>
   * Outputs a warning to the console that this method should be implemented by the derived class.
   * </p>
   * <p>
   * <em>This method should be implemented by derived classes.</em>
   * </p>
   * <p>
   * <em>Not implementing this method in a derived class risks leaking resources allocated by the derived class.</em>
   * </p>
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
  }
}

export = Shareable;