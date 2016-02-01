define(["require", "exports"], function (require, exports) {
    var Framerate = (function () {
        function Framerate(id) {
            this.renderTime = -1;
            this.framerates = [];
            this.numFramerates = 10;
            this.framerateUpdateInterval = 500;
            this.id = id;
            var self = this;
            var fr = function () { self.updateFramerate(); };
            setInterval(fr, this.framerateUpdateInterval);
        }
        Framerate.prototype.updateFramerate = function () {
            var tot = 0;
            for (var i = 0; i < this.framerates.length; ++i) {
                tot += this.framerates[i];
            }
            var framerate = tot / this.framerates.length;
            framerate = Math.round(framerate);
            document.getElementById(this.id).innerHTML = "Framerate:" + framerate + "fps";
        };
        Framerate.prototype.snapshot = function () {
            if (this.renderTime < 0) {
                this.renderTime = new Date().getTime();
            }
            else {
                var newTime = new Date().getTime();
                var t = newTime - this.renderTime;
                if (t === 0) {
                    return;
                }
                var framerate = 1000 / t;
                this.framerates.push(framerate);
                while (this.framerates.length > this.numFramerates) {
                    this.framerates.shift();
                }
                this.renderTime = newTime;
            }
        };
        return Framerate;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Framerate;
});
