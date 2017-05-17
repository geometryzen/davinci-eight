import { isDefined } from '../checks/isDefined';
import { mustBeEQ } from '../checks/mustBeEQ';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeString } from '../checks/mustBeString';
import { readOnly } from '../i18n/readOnly';
import { refChange } from './refChange';
import { uuid4 } from './uuid4';
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
var ShareableBase = (function () {
    /**
     *
     */
    function ShareableBase() {
        /**
         * The unique identifier used for reference count monitoring.
         */
        this._uuid = uuid4().generate();
        this._type = 'ShareableBase';
        this._levelUp = 0;
        this._refCount = 1;
        refChange(this._uuid, this._type, +1);
    }
    /**
     * Experimental
     *
     * restore (a zombie) to life.
     */
    ShareableBase.prototype.resurrector = function (levelUp, grumble) {
        if (grumble === void 0) { grumble = false; }
        if (grumble) {
            throw new Error("`protected resurrector(levelUp: number): void` method should be implemented by `" + this._type + "`.");
        }
        this._levelUp = 0;
        this._refCount = 1;
        refChange(this._uuid, this._type, +1);
    };
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
    ShareableBase.prototype.destructor = function (levelUp, grumble) {
        if (grumble === void 0) { grumble = false; }
        mustBeInteger('levelUp', levelUp);
        mustBeEQ(this._type + " constructor-destructor chain mismatch: destructor index " + levelUp, levelUp, this._levelUp);
        if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
        }
        // This is the sentinel that this destructor was eventually called.
        // We can check this invariant in the final release method.
        this._levelUp = void 0;
    };
    Object.defineProperty(ShareableBase.prototype, "levelUp", {
        /**
         * Returns the total length of the inheritance hierarchy that this instance is involved in.
         */
        get: function () {
            return this._levelUp;
        },
        set: function (levelUp) {
            // The only way the level gets changed is through setLoggingName.
            throw new Error(readOnly('levelUp').message);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * An object is a zombie if it has been released by all who have held references.
     * In some cases it may be possible to recycle a zombie.
     */
    ShareableBase.prototype.isZombie = function () {
        return typeof this._refCount === 'undefined';
    };
    /**
     * <p>
     * Notifies this instance that something is referencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    ShareableBase.prototype.addRef = function () {
        if (this.isZombie()) {
            this.resurrector(0, true);
            return this._refCount;
        }
        else {
            this._refCount++;
            refChange(this._uuid, this._type, +1);
            return this._refCount;
        }
    };
    /**
     * Returns the name that was assigned by the call to the setLoggingName method.
     */
    ShareableBase.prototype.getLoggingName = function () {
        return this._type;
    };
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
    ShareableBase.prototype.setLoggingName = function (name) {
        this._type = mustBeString('name', name);
        this._levelUp += 1;
        // Update the name used by the reference count tracking.
        refChange(this._uuid, name, +1);
        refChange(this._uuid, name, -1);
    };
    /**
     * <p>
     * Notifies this instance that something is dereferencing it.
     * </p>
     *
     * @returns The new value of the reference count.
     */
    ShareableBase.prototype.release = function () {
        this._refCount--;
        refChange(this._uuid, this._type, -1);
        var refCount = this._refCount;
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
                throw new Error(this._type + ".destructor method is not calling all the way up the chain.");
            }
        }
        return refCount;
    };
    Object.defineProperty(ShareableBase.prototype, "uuid", {
        get: function () {
            return this._uuid;
        },
        enumerable: true,
        configurable: true
    });
    return ShareableBase;
}());
export { ShareableBase };
