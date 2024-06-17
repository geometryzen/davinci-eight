import { isDefined } from "../checks/isDefined";
import { mustBeEQ } from "../checks/mustBeEQ";
import { mustBeInteger } from "../checks/mustBeInteger";
import { mustBeString } from "../checks/mustBeString";
import { Shareable } from "../core/Shareable";
// import { readOnly } from '../i18n/readOnly';
import { refChange } from "./refChange";
import { uuid4 } from "./uuid4";

/**
 * <p>
 * Convenient base class for derived classes implementing <code>Shareable</code>.
 * </p>
 */
export class ShareableBase implements Shareable {
    /**
     *
     */
    private _refCount: number;
    /**
     *
     */
    private _type: string;
    /**
     * The unique identifier used for reference count monitoring.
     */
    private _uuid: string = uuid4().generate();
    /**
     * Keeps track of the level in the hierarchy of classes.
     */
    private _levelUp: number;
    /**
     *
     */
    constructor() {
        this._type = "ShareableBase";
        this._levelUp = 0;
        this._refCount = 1;
        refChange(this._uuid, this._type, +1);
    }

    /**
     * @hidden
     * Experimental
     *
     * restore (a zombie) to life.
     */
    protected resurrector(levelUp: number, grumble = false): void {
        if (grumble) {
            throw new Error("`protected resurrector(levelUp: number): void` method should be implemented by `" + this._type + "`.");
        }
        this._levelUp = 0;
        this._refCount = 1;
        refChange(this._uuid, this._type, +1);
    }

    /**
     * @hidden
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
        mustBeInteger("levelUp", levelUp);
        mustBeEQ(`${this._type} constructor-destructor chain mismatch: destructor index ${levelUp}`, levelUp, this._levelUp);
        if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
        }
        // This is the sentinel that this destructor was eventually called.
        // We can check this invariant in the final release method.
        this._levelUp = void 0;
    }

    /**
     * Returns the total length of the inheritance hierarchy that this instance is involved in.
     */
    /*
    private get levelUp(): number {
        return this._levelUp;
    }
    private set levelUp(levelUp: number) {
        // The only way the level gets changed is through setLoggingName.
        throw new Error(readOnly('levelUp').message);
    }
    */

    /**
     * An object is a zombie if it has been released by all who have held references.
     * In some cases it may be possible to recycle a zombie.
     */
    public isZombie(): boolean {
        return typeof this._refCount === "undefined";
    }

    /**
     * <p>
     * Notifies this instance that something is referencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    public addRef(): number {
        if (this.isZombie()) {
            this.resurrector(0, true);
            return this._refCount;
        } else {
            this._refCount++;
            refChange(this._uuid, this._type, +1);
            return this._refCount;
        }
    }

    /**
     * Returns the name that was assigned by the call to the setLoggingName method.
     */
    public getLoggingName(): string {
        return this._type;
    }

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
    protected setLoggingName(name: string): void {
        this._type = mustBeString("name", name);
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
    /*
    private get uuid(): string {
        return this._uuid;
    }
    */
}
