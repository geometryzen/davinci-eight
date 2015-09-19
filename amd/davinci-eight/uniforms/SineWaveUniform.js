var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable'], function (require, exports, Shareable) {
    var SineWaveUniform = (function (_super) {
        __extends(SineWaveUniform, _super);
        function SineWaveUniform(omega, uName) {
            if (uName === void 0) { uName = 'uSineWave'; }
            _super.call(this, 'SineWaveUniform');
            this.amplitude = 1;
            this.mean = 0;
            this.omega = omega;
            this.uName = uName;
        }
        SineWaveUniform.prototype.accept = function (visitor) {
            var time = Date.now() / 1000;
            var theta = this.omega * time;
            var a = this.amplitude * Math.sin(theta) + this.mean;
            visitor.uniform1f(this.uName, a);
        };
        return SineWaveUniform;
    })(Shareable);
    return SineWaveUniform;
});
