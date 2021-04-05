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
        this.$attitude = Geometric3.zero(false);
        this.head = new ArrowHead(contextManager, options, levelUp);
        this.tail = new ArrowTail(contextManager, options, levelUp);
        this.$vector.copyVector(this.head.vector).addVector(this.tail.vector);
        this.$vectorLock = this.$vector.lock();
        this.$attitude.copySpinor(this.tail.attitude);
        this.$attitudeLock = this.$attitude.lock();
    }
    ArrowFH.prototype.render = function (ambients) {
        this.head.render(ambients);
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
        /**
         * The vector that is represented by the Arrow.
         *
         * magnitude(Arrow.vector) = Arrow.length
         * direction(Arrow.vector) = Arrow.axis
         * Arrow.vector = Arrow.length * Arrow.axis
         */
        get: function () {
            return this.$vector;
        },
        set: function (vector) {
            this.length = normVectorE3(vector);
            // Don't try to set the direction for the zero vector.
            if (this.length !== 0) {
                this.head.axis = vector;
                this.tail.axis = vector;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "length", {
        /**
         * The length of the Arrow.
         * This property determines the scaling of the Arrow in all directions.
         */
        get: function () {
            return this.head.heightCone + this.tail.heightShaft;
        },
        set: function (length) {
            // TODO
            var h = length * 0.2;
            var t = length * 0.8;
            this.head.heightCone = h;
            this.tail.heightShaft = t;
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
            // TODO: Mutability is a problem.
            return this.tail.X;
        },
        set: function (X) {
            this.setPosition(X);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowFH.prototype, "position", {
        get: function () {
            // TODO: Mutability is a problem.
            return this.tail.position;
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
        this.tail.position = position;
        this.moveHead();
    };
    ArrowFH.prototype.setAttitude = function (attitude) {
        this.$attitude.unlock(this.$attitudeLock);
        this.$attitude.copySpinor(attitude);
        this.$attitudeLock = this.$attitude.lock();
        this.tail.attitude = attitude;
        this.moveHead();
    };
    ArrowFH.prototype.moveHead = function () {
        this.head.attitude = this.tail.attitude;
        this.head.position.copyVector(this.tail.position).addVector(this.tail.vector);
    };
    return ArrowFH;
}());
export { ArrowFH };
