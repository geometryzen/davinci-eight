var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable', '../../math/R2'], function (require, exports, Shareable, R2) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Vector2Animation = (function (_super) {
        __extends(Vector2Animation, _super);
        function Vector2Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Vector2Animation');
            this.to = R2.copy(value);
            this.duration = duration;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Vector2Animation.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Vector2Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = new R2(data);
                    }
                }
            }
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
            // Simple easing support.
            var rolloff;
            switch (ease) {
                case 'in':
                    rolloff = 1 - (1 - fraction) * (1 - fraction);
                    break;
                case 'out':
                    rolloff = fraction * fraction;
                    break;
                case 'linear':
                    rolloff = fraction;
                    break;
                default:
                    rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
                    break;
            }
            var lerp = R2.lerp(this.from, this.to, rolloff);
            // The animator sends the data back to the animation target suitable for the R2 constructor.
            target.setProperty(propName, lerp.coords);
        };
        Vector2Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Vector2Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Vector2Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Vector2Animation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                // Set final value.
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        Vector2Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Vector2Animation;
    })(Shareable);
    return Vector2Animation;
});