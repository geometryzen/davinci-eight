var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../core/Shareable'], function (require, exports, Shareable_1) {
    var WaitAnimation = (function (_super) {
        __extends(WaitAnimation, _super);
        function WaitAnimation(duration) {
            _super.call(this, 'WaitAnimation');
            this.duration = duration;
            this.fraction = 0;
        }
        WaitAnimation.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        WaitAnimation.prototype.apply = function (target, propName, now, offset) {
            if (!this.start) {
                this.start = now - offset;
            }
            if (this.duration > 0) {
                this.fraction = Math.min(1, (now - this.start) / this.duration);
            }
            else {
                this.fraction = 1;
            }
        };
        WaitAnimation.prototype.skip = function () {
            this.duration = 0;
        };
        WaitAnimation.prototype.hurry = function (factor) {
            this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        WaitAnimation.prototype.extra = function (now) {
            return now - this.start - this.duration;
        };
        WaitAnimation.prototype.done = function (target, propName) {
            return this.fraction === 1;
        };
        WaitAnimation.prototype.undo = function (target, propName) {
            this.start = void 0;
            this.fraction = 0;
        };
        return WaitAnimation;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WaitAnimation;
});
