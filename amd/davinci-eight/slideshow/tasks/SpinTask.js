var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../slideshow/animations/SpinTo', '../../utils/Shareable'], function (require, exports, SpinTo, Shareable) {
    var SpinTask = (function (_super) {
        __extends(SpinTask, _super);
        function SpinTask(name, attitude, duration) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'SpinTask');
            this.options = {};
            this.name = name;
            this.attitude = attitude;
            this.duration = duration;
            this.ease = 'linear';
        }
        SpinTask.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        SpinTask.prototype.exec = function (slide, host) {
            var thing = host.getDrawable(this.name);
            if (thing) {
                try {
                    var model = thing.getFacet('model');
                    try {
                        var moveTo = new SpinTo(slide.clock, model, 'attitude', this.attitude, this.duration, this.callback, this.ease);
                        try {
                            slide.animate(model, { 'attitude': moveTo }, this.options);
                        }
                        finally {
                            moveTo.release();
                        }
                    }
                    finally {
                        model.release();
                    }
                }
                finally {
                    thing.release();
                }
            }
            else {
                console.warn(this.name + ' drawable not found');
            }
        };
        SpinTask.prototype.undo = function (slide, host) {
        };
        return SpinTask;
    })(Shareable);
    return SpinTask;
});
