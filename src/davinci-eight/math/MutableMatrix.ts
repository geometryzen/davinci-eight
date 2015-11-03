/**
 * @class Mutable
 */
interface MutableMatrix<T> {
    /**
     * @property elements
     * @type T
     */
    elements: T;
    /**
     * @property callback
     * @type () => T
     */
    callback: () => T;
}

export = MutableMatrix