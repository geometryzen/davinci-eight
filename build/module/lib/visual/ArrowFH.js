import { Color } from '../core/Color';
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
     */
    function ArrowFH(contextManager, options) {
        if (options === void 0) { options = {}; }
        this.$vector = Geometric3.zero(false);
        this.$position = Geometric3.zero(false);
        this.$attitude = Geometric3.zero(false);
        this.$color = Color.fromRGB(1, 1, 1);
        this.$isHeadVisible = true;
        this.head = new ArrowHead(contextManager, options);
        this.tail = new ArrowTail(contextManager, options);
        this.$vector.copyVector(this.head.vector).addVector(this.tail.vector);
        this.$vectorLock = this.$vector.lock();
        this.$position.copyVector(this.tail.position);
        this.$positionLock = this.$position.lock();
        this.$attitude.copySpinor(this.tail.attitude);
        this.$attitudeLock = this.$attitude.lock();
        this.$color.copy(this.tail.color);
        this.$colorLock = this.$color.lock();
        this.updateHeadAttitude();
        this.updateHeadPosition();
    }
    ArrowFH.prototype.render = function (ambients) {
        if (this.$isHeadVisible) {
            this.head.render(ambients);
        }
        this.tail.render(ambients);
    };
    /**
     * @hidden
     */
    ArrowFH.prototype.contextFree = function () {
        this.head.contextFree();
        this.tail.contextFree();
    };
    /**
     * @hidden
     */
    ArrowFH.prototype.contextGain = function () {
        this.head.contextGain();
        this.tail.contextGain();
    };
    /**
     * @hidden
     */
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
        /**
         * The vector from the tail of the arrow to the head of the arrow.
         */
        get: function () {
            return this.$vector;
        },
        set: function (vector) {
            this.$vector.unlock(this.$vectorLock);
            this.$vector.copyVector(vector);
            this.$vectorLock = this.$vector.lock();
            var magnitude = normVectorE3(vector);
            var heightShaft = magnitude - this.head.heightCone;
            if (heightShaft >= 0) {
                this.$isHeadVisible = true;
                this.tail.heightShaft = heightShaft;
                this.updateHeadPosition();
            }
            else {
                this.$isHeadVisible = false;
                this.tail.heightShaft = magnitude;
            }
            // Don't try to set the direction for the zero vector.
            if (magnitude > 0) {
                this.head.axis = vector;
                this.tail.axis = vector;
            }
            this.updateHeadPosition();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @hidden
     */
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
        /**
         * Alias for `position`.
         */
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
        /**
         * The position (vector).
         */
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
        /**
         * Alias for `attitude`.
         */
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
        /**
         * The attitude (spinor).
         */
        get: function () {
            return this.$attitude;
        },
        set: function (attitude) {
            this.setAttitude(attitude);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "color", {
        get: function () {
            return this.$color;
        },
        set: function (color) {
            this.$color.unlock(this.$colorLock);
            this.$color.copy(color);
            this.$colorLock = this.$color.lock();
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
