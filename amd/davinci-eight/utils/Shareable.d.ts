import IUnknown = require('../core/IUnknown');
/**
 * @class Shareable
 */
declare class Shareable implements IUnknown {
    private _refCount;
    protected _type: string;
    private _uuid;
    /**
     * <p>
     * Convenient base class for derived classes implementing <code>IUnknown</code>.
     * </p>
     * @class Shareable
     * @extends IUnknown
     * @constructor
     * @param type {string} The human-readable name of the derived type.
     */
    constructor(type: string);
    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @method addRef
     * @return {number} The new value of the reference count.
     */
    addRef(): number;
    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @method release
     * @return {number} The new value of the reference count.
     */
    release(): number;
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
    protected destructor(grumble?: boolean): void;
    /**
     * @property uuid
     * @type {string}
     * @readOnly
     */
    uuid: string;
}
export = Shareable;
