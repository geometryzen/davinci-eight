import { isDefined } from '../checks/isDefined';
import { isUndefined } from '../checks/isUndefined';
import { lockable, TargetLockedError } from '../core/Lockable';
import { mustSatisfy } from '../checks/mustSatisfy';
function pushString(T) {
    return "push(value: " + T + "): number";
}
function popString(T) {
    return "pop(): " + T;
}
function verboten(operation) {
    return operation + " is not allowed for a fixed size vector";
}
function verbotenPush() {
    return verboten(pushString('T'));
}
function verbotenPop() {
    return verboten(popString('T'));
}
/**
 *
 */
var VectorN = (function () {
    /**
     *
     * @param data
     * @param modified
     * @param size
     */
    function VectorN(data, modified, size) {
        if (modified === void 0) { modified = false; }
        /**
         *
         */
        this.lock_ = lockable();
        this.modified_ = modified;
        if (isDefined(size)) {
            this.size_ = size;
            this.data_ = data;
            mustSatisfy('data.length', data.length === size, function () { return "" + size; });
        }
        else {
            this.size_ = void 0;
            this.data_ = data;
        }
    }
    VectorN.prototype.isLocked = function () {
        return this.lock_.isLocked();
    };
    VectorN.prototype.lock = function () {
        return this.lock_.lock();
    };
    VectorN.prototype.unlock = function (token) {
        return this.lock_.unlock(token);
    };
    Object.defineProperty(VectorN.prototype, "coords", {
        /**
         *
         */
        get: function () {
            return this.data_;
        },
        set: function (data) {
            if (this.isLocked()) {
                throw new TargetLockedError('coords');
            }
            this.data_ = data;
            this.modified_ = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorN.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VectorN.prototype, "length", {
        /**
         *
         */
        get: function () {
            return this.coords.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    VectorN.prototype.clone = function () {
        return new VectorN(this.data_, this.modified_, this.size_);
    };
    /**
     * @param index
     */
    VectorN.prototype.getComponent = function (index) {
        return this.coords[index];
    };
    /**
     *
     */
    VectorN.prototype.pop = function () {
        if (this.isLocked()) {
            throw new TargetLockedError('pop');
        }
        if (isUndefined(this.size_)) {
            return this.coords.pop();
        }
        else {
            throw new Error(verbotenPop());
        }
    };
    /**
     * @param value
     * @returns
     */
    VectorN.prototype.push = function (value) {
        if (this.isLocked()) {
            throw new TargetLockedError('push');
        }
        if (isUndefined(this.size_)) {
            var data = this.coords;
            var newLength = data.push(value);
            this.coords = data;
            return newLength;
        }
        else {
            throw new Error(verbotenPush());
        }
    };
    /**
     * @param index
     * @param value
     */
    VectorN.prototype.setComponent = function (index, value) {
        if (this.isLocked()) {
            throw new TargetLockedError('setComponent');
        }
        var coords = this.coords;
        var previous = coords[index];
        if (value !== previous) {
            coords[index] = value;
            this.coords = coords;
            this.modified_ = true;
        }
    };
    /**
     * @param array
     * @param offset
     * @returns
     */
    VectorN.prototype.toArray = function (array, offset) {
        if (array === void 0) { array = []; }
        if (offset === void 0) { offset = 0; }
        var data = this.coords;
        var length = data.length;
        for (var i = 0; i < length; i++) {
            array[offset + i] = data[i];
        }
        return array;
    };
    /**
     * @returns
     */
    VectorN.prototype.toLocaleString = function () {
        return this.coords.toLocaleString();
    };
    /**
     * @returns
     */
    VectorN.prototype.toString = function () {
        return this.coords.toString();
    };
    return VectorN;
}());
export { VectorN };
