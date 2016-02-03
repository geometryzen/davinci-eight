define(["require", "exports", '../checks/mustBeString', '../i18n/readOnly', '../utils/refChange', '../utils/uuid4'], function (require, exports, mustBeString_1, readOnly_1, refChange_1, uuid4_1) {
    var Shareable = (function () {
        function Shareable(type) {
            this._refCount = 1;
            this._uuid = uuid4_1.default().generate();
            this._type = mustBeString_1.default('type', type);
            refChange_1.default(this._uuid, type, +1);
        }
        Shareable.prototype.isZombie = function () {
            return typeof this._refCount === 'undefined';
        };
        Shareable.prototype.addRef = function () {
            this._refCount++;
            refChange_1.default(this._uuid, this._type, +1);
            return this._refCount;
        };
        Shareable.prototype.release = function () {
            this._refCount--;
            refChange_1.default(this._uuid, this._type, -1);
            var refCount = this._refCount;
            if (refCount === 0) {
                this.destructor(true);
                this._refCount = void 0;
                this._type = void 0;
                this._uuid = void 0;
            }
            return refCount;
        };
        Shareable.prototype.destructor = function (grumble) {
            if (grumble === void 0) { grumble = false; }
            if (grumble) {
                console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
            }
        };
        Object.defineProperty(Shareable.prototype, "uuid", {
            get: function () {
                return this._uuid;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uuid').message);
            },
            enumerable: true,
            configurable: true
        });
        return Shareable;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Shareable;
});
