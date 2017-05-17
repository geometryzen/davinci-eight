/**
 *
 */
export interface Shareable {
    /**
     *
     * Increments the reference count of an Shareable instance.
     *
     * @return The new reference count. This value is intended to be used only for test purposes.
     */
    addRef?(): number;
    /**
     *
     * Decrements the reference count of an Shareable instance.
     *
     * @return The new reference count. This value is intended to be used only for test purposes.
     */
    release?(): number;
}
