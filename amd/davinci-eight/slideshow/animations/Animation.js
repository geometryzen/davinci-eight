var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    function loop(n, callback) {
        for (var i = 0; i < n; ++i) {
            callback(i);
        }
    }
    var Animation = (function (_super) {
        __extends(Animation, _super);
        function Animation(host, object, key, value, duration, callback, ease) {
            _super.call(this, 'Animation');
            this.host = host;
            // this.host.
            this.object = object;
            this.object.addRef();
            this.key = key;
            this.from = void 0;
            this.to = value;
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
            this.callback = callback;
            this.ease = ease;
        }
        Animation.prototype.destructor = function () {
            this.object.release();
            this.object = void 0;
        };
        Animation.prototype.init = function (offset) {
            if (offset === void 0) { offset = 0; }
            this.start = this.host.now - offset;
            if (this.from === void 0) {
                this.from = this.object.getProperty(this.key);
            }
        };
        Animation.prototype.apply = function (offset) {
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
            // Linear interpolation
            function lerp(from, to) {
                return from + (to - from) * rolloff;
            }
            // Interpolate between two arbitrary values/objects.
            function interpolate(from, to) {
                // Handle default cases.
                if (to === undefined) {
                    to = from;
                }
                if (from === undefined) {
                    from = to;
                }
                if (to === from) {
                    return from;
                }
                var out;
                if (!from) {
                    return to;
                }
                if (!to) {
                    return from;
                }
                out = [];
                loop(from.length, function (i) {
                    out[i] = lerp(from[i], to[i]);
                });
                return out;
                return (fraction > 0.5) ? to : from;
            }
            this.object.setProperty(this.key, interpolate(from, to));
        };
        Animation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Animation.prototype.skip = function () {
            this.duration = 0;
            this.fraction = 1;
            this.done();
        };
        Animation.prototype.extra = function () {
            return this.host.now - this.start - this.duration;
        };
        Animation.prototype.done = function () {
            if (this.fraction === 1) {
                // Set final value.
                this.object.setProperty(this.key, this.to);
                this.callback && this.callback();
                this.callback = void 0;
                return true;
            }
            else {
                return false;
            }
        };
        return Animation;
    })(Shareable);
    return Animation;
});
