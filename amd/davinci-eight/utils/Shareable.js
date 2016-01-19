define(["require", "exports", '../checks/mustBeString', '../i18n/readOnly', '../utils/refChange', '../utils/uuid4'], function (require, exports, mustBeString, readOnly, refChange, uuid4) {
    /**
     * @class Shareable
     */
    var Shareable = (function () {
        /**
         * <p>
         * Convenient base class for derived classes implementing <code>IUnknown</code>.
         * </p>
         * @class Shareable
         * @extends IUnknown
         * @constructor
         * @param type {string} The human-readable name of the derived type.
         */
        function Shareable(type) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this._type = mustBeString('type', type);
            refChange(this._uuid, type, +1);
        }
        /**
         * <p>
         * Notifies this instance that something is dereferencing it.
         * </p>
         *
         * @method addRef
         * @return {number} The new value of the reference count.
         */
        Shareable.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, this._type, +1);
            return this._refCount;
        };
        /**
         * <p>
         * Notifies this instance that something is dereferencing it.
         * </p>
         *
         * @method release
         * @return {number} The new value of the reference count.
         */
        Shareable.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, this._type, -1);
            var refCount = this._refCount;
            if (refCount === 0) {
                // destructor called with `true` means grumble if the method has not been overridden.
                this.destructor(true);
                this._refCount = void 0;
                this._type = void 0;
                this._uuid = void 0;
            }
            return refCount;
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
         * @method destructor
         * @return {void}
         * @protected
         */
        Shareable.prototype.destructor = function (grumble) {
            if (grumble === void 0) { grumble = false; }
            if (grumble) {
                console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
            }
        };
        Object.defineProperty(Shareable.prototype, "uuid", {
            /**
             * @property uuid
             * @type {string}
             * @readOnly
             */
            get: function () {
                return this._uuid;
            },
            set: function (unused) {
                throw new Error(readOnly('uuid').message);
            },
            enumerable: true,
            configurable: true
        });
        return Shareable;
    })();
    return Shareable;
});
