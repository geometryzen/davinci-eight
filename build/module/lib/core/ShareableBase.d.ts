import { Shareable } from '../core/Shareable';
/**
 * <p>
 * Convenient base class for derived classes implementing <code>Shareable</code>.
 * </p>
 *
 *
 *     class MyShareableClass extends ShareableBase {
 *       constructor() {
 *         // First thing you do is call super to invoke constructors up the chain.
 *         super()
 *         // Setting the logging name is both a good practice and increments the tally
 *         // of constructors in the constructor chain. The runtime architecture will
 *         // verify that the number of destructor calls matches these logging name calls.
 *         this.setLoggingName('MyShareableClass')
 *         // Finally, your initialization code here.
 *         // addRef and shared resources, maybe create owned resources.
 *       }
 *       protected destructor(levelUp: number): void {
 *         // Firstly, your termination code here.
 *         // Release any shared resources and/or delete any owned resources.
 *         // Last thing you do is to call the super destructor, incrementing the level.
 *         // The runtime architecture will verify that the destructor count matches the
 *         // constructor count.
 *         super.destructor(levelUp + 1)
 *       }
 *     }
 *
 */
export declare class ShareableBase implements Shareable {
    /**
     *
     */
    private _refCount;
    /**
     *
     */
    private _type;
    /**
     * The unique identifier used for reference count monitoring.
     */
    private _uuid;
    /**
     * Keeps track of the level in the hierarchy of classes.
     */
    private _levelUp;
    /**
     *
     */
    constructor();
    /**
     * Experimental
     *
     * restore (a zombie) to life.
     */
    protected resurrector(levelUp: number, grumble?: boolean): void;
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
     * @param levelUp A number that should be incremented for each destructor call.
     */
    protected destructor(levelUp: number, grumble?: boolean): void;
    /**
     * Returns the total length of the inheritance hierarchy that this instance is involved in.
     */
    private levelUp;
    /**
     * An object is a zombie if it has been released by all who have held references.
     * In some cases it may be possible to recycle a zombie.
     */
    isZombie(): boolean;
    /**
     * <p>
     * Notifies this instance that something is referencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    addRef(): number;
    /**
     * Returns the name that was assigned by the call to the setLoggingName method.
     */
    getLoggingName(): string;
    /**
     * This method is for use within constructors.
     *
     * Immediately after a call to the super class constructor, make a call to setLoggingName.
     * This will have the effect of refining the name used for reporting reference counts.
     *
     * This method has the secondary purpose of enabling a tally of the number of classes
     * in the constructor chain. This enables the runtime architecture to verify that destructor
     * chains are consistent with constructor chains, which is a good practice for cleaning up resources.
     *
     * Notice that this method is intentionally protected to discourage it from being called outside of the constructor.
     *
     * @param name This will usually be set to the name of the class.
     */
    protected setLoggingName(name: string): void;
    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    release(): number;
    private readonly uuid;
}
