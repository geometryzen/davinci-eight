/**
 * <p>
 * Enables clients to manage the existence of an object through the addRef and release methods.
 * </p>
 * @class IUnknown
 * @since 2.75.0
 */
interface IUnknown {
  /**
   * <p>
   * Increments the reference count of an IUnknown instance.
   * </p>
   * @method addRef
   * @return {number}
   * <p>
   * The new reference count. This value is intended to be used only for test purposes.
   * </p>
   */
  addRef(): number;
  /**
   * <p>
   * Decrements the reference count of an IUnknown instance.
   * </p>
   * @method release
   * @return {number}
   * <p>
   * The new reference count. This value is intended to be used only for test purposes.
   * </p>
   */
  release(): number;
}

export = IUnknown;