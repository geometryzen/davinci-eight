var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable', '../../math/Spinor3'], function (require, exports, Shareable, Spinor3) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var SpinTo = (function (_super) {
        __extends(SpinTo, _super);
        function SpinTo(host, object, key, value, duration, callback, ease) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'SpinTo');
            this.host = host;
            // this.host.
            this.object = object;
            this.object.addRef();
            this.key = key;
            this.from = void 0;
            this.to = Spinor3.copy(value);
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        SpinTo.prototype.destructor = function () {
            this.object.release();
            this.object = void 0;
        };
        SpinTo.prototype.init = function (offset) {
            if (offset === void 0) { offset = 0; }
            this.start = this.host.now - offset;
            if (this.from === void 0) {
                var data = this.object.getProperty(this.key);
                if (data) {
                    this.from = new Spinor3(data);
                }
            }
        };
        SpinTo.prototype.apply = function (offset) {
            if (!this.start) {
                this.init(offset);
            }
            var object = this.object;
            var from = this.from;
            var to = this.to;
            var key = this.key;
            var ease = this.ease;
            // Calculate animation progress / fraction.
            var fraction;
            if (this.duration > 0) {
                fraction = Math.min(1, (this.host.now - this.start) / (this.duration || 1));
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
            var lerp = Spinor3.lerp(from, to, fraction);
            this.object.setProperty(this.key, lerp.data);
        };
        SpinTo.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        SpinTo.prototype.skip = function () {
            this.duration = 0;
            this.fraction = 1;
            this.done();
        };
        SpinTo.prototype.extra = function () {
            return this.host.now - this.start - this.duration;
        };
        SpinTo.prototype.done = function () {
            if (this.fraction === 1) {
                // Set final value.
                this.object.setProperty(this.key, this.to.data);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        return SpinTo;
    })(Shareable);
    return SpinTo;
});
