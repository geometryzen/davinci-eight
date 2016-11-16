import isDefined from '../checks/isDefined';
import mustBeEQ from '../checks/mustBeEQ';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import readOnly from '../i18n/readOnly';
import refChange from './refChange';
import { Shareable } from '../core/Shareable';
import uuid4 from './uuid4';

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
export class ShareableBase implements Shareable {

    /**
     *
     */
    private _refCount: number = 1;

    /**
     *
     */
    protected _type: string;

    /**
     * The unique identifier used for reference count monitoring.
     */
    private _uuid: string = uuid4().generate();

    /**
     * <p>
     * Keeps track of the level in the hierarchy of classes.
     * </p>
     */
    private _levelUp: number = -1;

    /**
     *
     */
    constructor() {
        this._type = 'ShareableBase';
        this._levelUp += 1;
        refChange(this._uuid, this._type, +1);
    }

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
    protected destructor(levelUp: number, grumble = false): void {
        mustBeInteger('levelUp', levelUp);
        mustBeEQ(`${this._type} constructor-destructor chain mismatch: destructor index ${levelUp}`, levelUp, this._levelUp);
        if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
        }
        // This is the sentinel that this destructor was eventually called.
        // We can check this invariant in the final release method.
        this._levelUp = void 0;
    }

    /**
     * <p>
     * Returns the total length of the inheritance hierarchy that this instance is involved in.
     * </p>
     */
    private get levelUp(): number {
        return this._levelUp;
    }
    private set levelUp(levelUp: number) {
        // The only way the level gets changed is through setLoggingName.
        throw new Error(readOnly('levelUp').message);
    }

    /**
     * An object is a zombie if it has been released by all who have held references.
     * In some cases it may be possible to recycle a zombie.
     */
    public isZombie(): boolean {
        return typeof this._refCount === 'undefined';
    }

    /**
     * <p>
     * Notifies this instance that something is referencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    public addRef(): number {
        this._refCount++;
        refChange(this._uuid, this._type, +1);
        return this._refCount;
    }

    /**
     * @returns
     */
    public getLoggingName(): string {
        return this._type;
    }

    /**
     * <p>
     * This method is for use within constructors.
     * <p>
     * <p>
     * Immediately after a call to the super class constructor, make a call to <code>setLoggingName</code>.
     * This will have the effect of refining the name used for reporting reference counts.
     * </p>
     * <p>
     * This method has the secondary purpose of enabling a tally of the number of classes
     * in the constructor chain. This enables the runtime architecture to verify that destructor
     * chains are consistent with constructor chains, which is a good practice for cleaning up resources.
     * </p>
     * <p>
     * Notice that this method is intentionally protected to discourage it from being called outside of the constructor.
     * </p>
     *
     * @param name
     */
    protected setLoggingName(name: string): void {
        this._type = mustBeString('name', name);
        this._levelUp += 1;
        // Update the name used by the reference count tracking.
        refChange(this._uuid, name, +1);
        refChange(this._uuid, name, -1);
    }

    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    public release(): number {
        this._refCount--;
        refChange(this._uuid, this._type, -1);
        const refCount = this._refCount;
        if (refCount === 0) {
            // destructor called with `true` means grumble if the method has not been overridden.
            // The following will call the most derived class first, if such a destructor exists.
            this.destructor(0, true);
            // refCount is used to indicate zombie status so let that go to undefined.
            this._refCount = void 0;
            // Keep the type and uuid around for debugging reference count problems.
            // this._type = void 0
            // this._uuid = void 0
            if (isDefined(this._levelUp)) {
                throw new Error(`${this._type}.destructor method is not calling all the way up the chain.`);
            }
        }
        return refCount;
    }

    /**
     *
     */
    private get uuid(): string {
        return this._uuid;
    }
}
