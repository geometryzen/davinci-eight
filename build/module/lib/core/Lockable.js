import { __extends } from "tslib";
/**
 * Sets the lock on the argument and returns the same argument.
 */
export function lock(m) {
    m.lock();
    return m;
}
var TargetLockedError = /** @class */ (function (_super) {
    __extends(TargetLockedError, _super);
    /**
     * `operationName` is the name of the operation, without parentheses or parameters.
     */
    function TargetLockedError(operationName) {
        return _super.call(this, "target of operation '" + operationName + "' must be mutable.") || this;
    }
    return TargetLockedError;
}(Error));
export { TargetLockedError };
var TargetUnlockedError = /** @class */ (function (_super) {
    __extends(TargetUnlockedError, _super);
    /**
     * `operationName` is the name of the operation, without parentheses.
     */
    function TargetUnlockedError(operationName) {
        return _super.call(this, "target of operation '" + operationName + "' must be immutable.") || this;
    }
    return TargetUnlockedError;
}(Error));
export { TargetUnlockedError };
export function lockable() {
    var lock_ = void 0;
    var that = {
        isLocked: function () {
            return typeof lock_ === 'number';
        },
        lock: function () {
            if (that.isLocked()) {
                throw new Error("already locked");
            }
            else {
                lock_ = Math.random();
                return lock_;
            }
        },
        unlock: function (token) {
            if (typeof token !== 'number') {
                throw new Error("token must be a number.");
            }
            if (!that.isLocked()) {
                throw new Error("not locked");
            }
            else if (lock_ === token) {
                lock_ = void 0;
            }
            else {
                throw new Error("unlock denied");
            }
        }
    };
    return that;
}
/**
 * Lockable Mixin
 */
var LockableMixin = /** @class */ (function () {
    function LockableMixin() {
    }
    LockableMixin.prototype.isLocked = function () {
        return typeof this['lock_'] === 'number';
    };
    LockableMixin.prototype.lock = function () {
        if (this.isLocked()) {
            throw new Error("already locked");
        }
        else {
            this['lock_'] = Math.random();
            return this['lock_'];
        }
    };
    LockableMixin.prototype.unlock = function (token) {
        if (typeof token !== 'number') {
            throw new Error("token must be a number.");
        }
        if (!this.isLocked()) {
            throw new Error("not locked");
        }
        else if (this['lock_'] === token) {
            this['lock_'] = void 0;
        }
        else {
            throw new Error("unlock denied");
        }
    };
    return LockableMixin;
}());
export { LockableMixin };
