import isDefined from '../checks/isDefined';
import mustBeEQ from '../checks/mustBeEQ';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import readOnly from '../i18n/readOnly';
import refChange from './refChange';
import Shareable from '../core/Shareable';
import uuid4 from './uuid4';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class ShareableBase
 */
export default class ShareableBase implements Shareable {

  /**
   * @property _refCount
   * @type number
   * @private
   */
  private _refCount: number = 1

  /**
   * @property _type
   * @type string
   * @protected
   */
  protected _type: string

  /**
   * The unique identifier used for reference count monitoring.
   *
   * @property _uuid
   * @type string
   * @private
   */
  private _uuid: string = uuid4().generate()

  /**
   * <p>
   * Keeps track of the depth in the hierarchy of classes.
   * </p>
   * <p>
   * A class constructed with a shareLength of zero is the most derived class in the hierarchy.
   * Such a class calls its' base class constructor with an incremented shareLength.
   * </p>
   * <p>
   * When the destructor chain is invoked, ...
   * </p>
   * @property _level
   * @type number
   * @private
   */
  private _level: number

  /**
   * <p>
   * Convenient base class for derived classes implementing <code>Shareable</code>.
   * </p>
   * @class ShareableBase
   * @extends Shareable
   * @constructor
   * @param type {string} The human-readable name of the derived type.
   * @param level {number} a number that should be incremented for each super.constructor call.
   */
  constructor(type: string, level: number) {
    this._type = mustBeString('type', type)
    this._level = mustBeInteger('level', level)
    refChange(this._uuid, type, +1)
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
   *
   * @method destructor
   * @param level {number} A number that should be incremented for each destructor call.
   * @return {void}
   * @protected
   */
  protected destructor(level: number, grumble = false): void {
    mustBeInteger('level', level)
    mustBeEQ(`${this._type} constructor-destructor chain mismatch: destructor index ${level}`, level, this._level)
    if (grumble) {
      console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.")
    }
    // This is the sentinel that this destructor was eventually called.
    // We can check this invariant in the final release method.
    this._level = void 0
  }

  /**
   * <p>
   * Returns the total length of the inheritance hierarchy that this instance is involved in.
   * </p>
   *
   * @property shareLength
   * @type number
   * @readOnly
   * @private
   */
  private get shareLength(): number {
    return this._level + 1
  }
  private set shareLength(shareLength: number) {
    throw new Error(readOnly('shareLength').message)
  }

  /**
   * @method isZombie
   * @return {boolean}
   */
  public isZombie(): boolean {
    return typeof this._refCount === 'undefined';
  }

  /**
   * <p>
   * Notifies this instance that something is referencing it.
   * </p>
   *
   * @method addRef
   * @return {number} The new value of the reference count.
   */
  public addRef(): number {
    this._refCount++
    refChange(this._uuid, this._type, +1)
    return this._refCount
  }

  /**
   * <p>
   * Notifies this instance that something is dereferencing it.
   * </p>
   *
   * @method release
   * @return {number} The new value of the reference count.
   */
  public release(): number {
    this._refCount--
    refChange(this._uuid, this._type, -1)
    const refCount = this._refCount
    if (refCount === 0) {
      // destructor called with `true` means grumble if the method has not been overridden.
      // The following will call the most derived class first, if such a destructor exists.
      this.destructor(0, true)
      // refCount is used to indicate zombie status so let that go to undefined.
      this._refCount = void 0
      // Keep the type and uuid around for debugging reference count problems.
      // this._type = void 0
      // this._uuid = void 0
      if (isDefined(this._level)) {
        throw new Error(`${this._type}.destructor method is not calling all the way up the chain.`)
      }
    }
    return refCount;
  }

  /**
   * @property uuid
   * @type {string}
   * @private
   * @readOnly
   */
  private get uuid(): string {
    return this._uuid
  }
  private set uuid(unused: string) {
    throw new Error(readOnly('uuid').message)
  }
}
