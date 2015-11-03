var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable', '../../math/SpinG3'], function (require, exports, Shareable, SpinG3) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Spinor3Animation = (function (_super) {
        __extends(Spinor3Animation, _super);
        function Spinor3Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Spinor3Animation');
            this.from = void 0;
            this.to = SpinG3.copy(value);
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Spinor3Animation.prototype.destructor = function () {
        };
        Spinor3Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = new SpinG3();
                        this.from.coords = data;
                    }
                }
            }
            var from = this.from;
            var to = this.to;
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
            var lerp = SpinG3.lerp(from, to, fraction);
            target.setProperty(propName, lerp.coords);
        };
        Spinor3Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Spinor3Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Spinor3Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Spinor3Animation.prototype.done = function (target, propName) {
            if (this.fraction === 1) {
                target.setProperty(propName, this.to.coords);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        Spinor3Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Spinor3Animation;
    })(Shareable);
    return Spinor3Animation;
});
