/**
 * @module EIGHT
 * @submodule core
 * @class IUnknown
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

export default IUnknown;
