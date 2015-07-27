/**
 * @class Mutable
 */
interface Mutable<T> {
    /**
     * @property data
     * @type T
     */
    data: T;
    /**
     * @property callback
     * @type () => T
     */
    callback: () => T;
}
export = Mutable;
