var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable', '../../math/SpinG2'], function (require, exports, Shareable_1, SpinG2_1) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Spinor2Animation = (function (_super) {
        __extends(Spinor2Animation, _super);
        function Spinor2Animation(value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'Spinor2Animation');
            this.from = void 0;
            this.to = SpinG2_1.default.copy(value);
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Spinor2Animation.prototype.destructor = function () {
        };
        Spinor2Animation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
                if (this.from === void 0) {
                    var data = target.getProperty(propName);
                    if (data) {
                        this.from = new SpinG2_1.default();
                        this.from.coords = data;
                    }
                }
            }
            var from = this.from;
            var to = this.to;
            var ease = this.ease;
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (now - this.start) / (this.duration || 1));
            }
            else {
                fraction = 1;
            }
            this.fraction = fraction;
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
            var lerp = SpinG2_1.default.lerp(from, to, fraction);
            target.setProperty(propName, lerp.coords);
        };
        Spinor2Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Spinor2Animation.prototype.skip = function (target, propName) {
            this.duration = 0;
            this.fraction = 1;
            this.done(target, propName);
        };
        Spinor2Animation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        Spinor2Animation.prototype.done = function (target, propName) {
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
        Spinor2Animation.prototype.undo = function (target, propName) {
            if (this.from) {
                target.setProperty(propName, this.from.coords);
                this.from = void 0;
                this.start = void 0;
                this.fraction = 0;
            }
        };
        return Spinor2Animation;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spinor2Animation;
});
