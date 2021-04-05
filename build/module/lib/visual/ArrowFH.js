import { Geometric3 } from '../math/Geometric3';
import { normVectorE3 } from '../math/normVectorE3';
import { ArrowHead } from './ArrowHead';
import { ArrowTail } from './ArrowTail';
/**
 * An arrow with a fixed head and variable length.
 */
var ArrowFH = /** @class */ (function () {
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    function ArrowFH(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        this.$vector = Geometric3.zero(false);
        this.$position = Geometric3.zero(false);
        this.$attitude = Geometric3.zero(false);
        this.$isHeadVisible = true;
        this.head = new ArrowHead(contextManager, options, levelUp);
        this.tail = new ArrowTail(contextManager, options, levelUp);
        this.$vector.copyVector(this.head.vector).addVector(this.tail.vector);
        this.$vectorLock = this.$vector.lock();
        this.$position.copyVector(this.tail.position);
        this.$positionLock = this.$position.lock();
        this.$attitude.copySpinor(this.tail.attitude);
        this.$attitudeLock = this.$attitude.lock();
        this.updateHeadAttitude();
        this.updateHeadPosition();
    }
    ArrowFH.prototype.render = function (ambients) {
        if (this.$isHeadVisible) {
            this.head.render(ambients);
        }
        this.tail.render(ambients);
    };
    ArrowFH.prototype.contextFree = function () {
        this.head.contextFree();
        this.tail.contextFree();
    };
    ArrowFH.prototype.contextGain = function () {
        this.head.contextGain();
        this.tail.contextGain();
    };
    ArrowFH.prototype.contextLost = function () {
        this.head.contextLost();
        this.tail.contextLost();
    };
    ArrowFH.prototype.addRef = function () {
        this.head.addRef();
        return this.tail.addRef();
    };
    ArrowFH.prototype.release = function () {
        this.head.release();
        return this.tail.release();
    };
    Object.defineProperty(ArrowFH.prototype, "vector", {
        get: function () {
            return this.$vector;
        },
        set: function (vector) {
            this.$vector.unlock(this.$vectorLock);
            this.$vector.copyVector(vector);
            this.$vectorLock = this.$vector.lock();
            this.length = normVectorE3(vector);
            // Don't try to set the direction for the zero vector.
            if (this.length !== 0) {
                this.head.axis = vector;
                this.tail.axis = vector;
            }
            this.updateHeadPosition();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "length", {
        get: function () {
            return this.head.heightCone + this.tail.heightShaft;
        },
        set: function (length) {
            if (length >= 0) {
                var heightShaft = length - this.head.heightCone;
                if (heightShaft >= 0) {
                    this.$isHeadVisible = true;
                    this.tail.heightShaft = heightShaft;
                    this.updateHeadPosition();
                }
                else {
                    this.$isHeadVisible = false;
                    this.tail.heightShaft = length;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    ArrowFH.prototype.isZombie = function () {
        if (this.head.isZombie()) {
            if (this.tail.isZombie()) {
                return true;
            }
            else {
                throw new Error();
            }
        }
        else {
            if (this.tail.isZombie()) {
                throw new Error();
            }
            else {
                return false;
            }
        }
    };
    Object.defineProperty(ArrowFH.prototype, "X", {
        get: function () {
            return this.$position;
        },
        set: function (X) {
            this.setPosition(X);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "position", {
        get: function () {
            return this.$position;
        },
        set: function (position) {
            this.setPosition(position);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "R", {
        get: function () {
            return this.$attitude;
        },
        set: function (R) {
            this.setAttitude(R);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "attitude", {
        get: function () {
            return this.$attitude;
        },
        set: function (attitude) {
            this.setAttitude(attitude);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "axis", {
        get: function () {
            return this.tail.axis;
        },
        set: function (axis) {
            this.head.axis = axis;
            this.tail.axis = axis;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "color", {
        get: function () {
            return this.head.color;
        },
        set: function (color) {
            this.head.color = color;
            this.tail.color = color;
        },
        enumerable: false,
        configurable: true
    });
    ArrowFH.prototype.setPosition = function (position) {
        this.$position.unlock(this.$positionLock);
        this.$position.copyVector(position);
        this.$positionLock = this.$position.lock();
        this.tail.position = position;
        this.updateHeadPosition();
    };
    ArrowFH.prototype.setAttitude = function (attitude) {
        this.$attitude.unlock(this.$attitudeLock);
        this.$attitude.copySpinor(attitude);
        this.$attitudeLock = this.$attitude.lock();
        this.tail.attitude = attitude;
        this.updateHeadPosition();
        this.updateHeadAttitude();
    };
    ArrowFH.prototype.updateHeadPosition = function () {
        this.head.position.copyVector(this.tail.position).addVector(this.tail.vector);
    };
    ArrowFH.prototype.updateHeadAttitude = function () {
        this.head.attitude = this.tail.attitude;
    };
    return ArrowFH;
}());
export { ArrowFH };
