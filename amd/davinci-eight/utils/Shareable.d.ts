import IUnknown = require('../core/IUnknown');
/**
 * <p>
 * Convenient base class for derived classes implementing IUnknown.
 * </p>
 *
 * @class Shareable
 * @implements IUnknown
 */
declare class Shareable implements IUnknown {
    private _refCount;
    private _type;
    private _uuid;
    /**
     * @class Shareable
     * @constructor
     * @param type {string} The human-readable name of the derived type.
     */
    constructor(type: string);
    /**
     * Notifies this instance that something is dereferencing it.
     *
     * @method addRef
     * @return {number} The new value of the reference count.
     */
    addRef(): number;
    /**
     * Notifies this instance that something is referencing it.
     *
     * @method release
     * @return {number} The new value of the reference count.
     */
    release(): number;
    /**
     * This method should be implemented by derived classes.
     *
     * @method destructor
     * @return {void}
     */
    protected destructor(): void;
}
export = Shareable;
