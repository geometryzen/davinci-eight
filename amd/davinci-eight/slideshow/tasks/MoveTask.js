var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../slideshow/animations/MoveTo', '../../utils/Shareable'], function (require, exports, MoveTo, Shareable) {
    var MoveTask = (function (_super) {
        __extends(MoveTask, _super);
        function MoveTask(name, position, duration) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'MoveTask');
            this.options = {};
            this.name = name;
            this.position = position;
            this.duration = duration;
            this.ease = 'linear';
        }
        MoveTask.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        MoveTask.prototype.exec = function (slide, host) {
            var thing = host.getDrawable(this.name);
            if (thing) {
                try {
                    var model = thing.getFacet('model');
                    try {
                        var moveTo = new MoveTo(slide.clock, model, 'position', this.position, this.duration, this.callback, this.ease);
                        try {
                            slide.animate(model, { 'position': moveTo }, this.options);
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
        MoveTask.prototype.undo = function (slide, host) {
        };
        return MoveTask;
    })(Shareable);
    return MoveTask;
});
