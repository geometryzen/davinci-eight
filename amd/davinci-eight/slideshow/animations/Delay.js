var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../utils/Shareable'], function (require, exports, Shareable) {
    var Delay = (function (_super) {
        __extends(Delay, _super);
        function Delay(host, object, key, duration) {
            _super.call(this, 'Delay');
            this.host = host;
            this.object = object;
            this.object.addRef();
            this.key = key;
            this.duration = duration;
            this.start = 0;
            this.fraction = 0;
        }
        Delay.prototype.destructor = function () {
            this.object.release();
            this.object = void 0;
        };
        Delay.prototype.init = function (offset) {
            if (offset === void 0) { offset = 0; }
            this.start = this.host.now - offset;
        };
        Delay.prototype.apply = function (offset) {
            if (!this.start) {
                this.init(offset);
            }
            if (this.duration > 0) {
                this.fraction = Math.min(1, (this.host.now - this.start) / this.duration);
            }
            else {
                this.fraction = 1;
            }
        };
        Delay.prototype.skip = function () {
            this.duration = 0;
        };
        Delay.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Delay.prototype.extra = function () {
            return this.host.now - this.start - this.duration;
        };
        Delay.prototype.done = function () {
            return this.fraction === 1;
        };
        return Delay;
    })(Shareable);
    return Delay;
});
