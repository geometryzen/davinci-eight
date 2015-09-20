define(["require", "exports", '../checks/mustBeString', '../utils/refChange', '../utils/uuid4'], function (require, exports, mustBeString, refChange, uuid4) {
    /**
     * <p>
     * Convenient base class for derived classes implementing IUnknown.
     * </p>
     *
     * @class Shareable
     * @implements IUnknown
     */
    var Shareable = (function () {
        /**
         * @class Shareable
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
         * Notifies this instance that something is dereferencing it.
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
         * Notifies this instance that something is dereferencing it.
         *
         * @method release
         * @return {number} The new value of the reference count.
         */
        Shareable.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, this._type, -1);
            var refCount = this._refCount;
            if (refCount === 0) {
                this.destructor();
                this._refCount = void 0;
                this._type = void 0;
                this._uuid = void 0;
            }
            return refCount;
        };
        /**
         * This method should be implemented by derived classes.
         *
         * @method destructor
         * @return {void}
         */
        Shareable.prototype.destructor = function () {
            console.warn("`destructor(): void` method should be implemented by `" + this._type + "`.");
        };
        return Shareable;
    })();
    return Shareable;
});
