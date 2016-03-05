/**
 * @module EIGHT
 * @submodule core
 * @class Shareable
 */
interface Shareable {
    /**
     * <p>
     * Increments the reference count of an Shareable instance.
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
     * Decrements the reference count of an Shareable instance.
     * </p>
     * @method release
     * @return {number}
     * <p>
     * The new reference count. This value is intended to be used only for test purposes.
     * </p>
     */
    release(): number;
}

export default Shareable;
