/**
 * @class Mutable
 */
interface Mutable<T> {
    /**
     * @property coords
     * @type T
     */
    coords: T;
    /**
     * @property callback
     * @type () => T
     */
    callback: () => T;
}

export = Mutable;