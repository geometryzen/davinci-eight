var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../slideshow/animations/ColorTo', '../../checks/mustBeString', '../../checks/mustBeNumber', '../../checks/mustBeObject', '../../utils/Shareable'], function (require, exports, ColorTo, mustBeString, mustBeNumber, mustBeObject, Shareable) {
    function ctorContext() {
        return 'ColorTask constructor';
    }
    var COLOR_RGB_DUCK = { red: 0, green: 0, blue: 0 };
    var ColorTask = (function (_super) {
        __extends(ColorTask, _super);
        function ColorTask(name, color, duration) {
            if (duration === void 0) { duration = 300; }
            _super.call(this, 'ColorTask');
            mustBeString('name', name, ctorContext);
            mustBeObject('color', color, ctorContext);
            mustBeNumber('color.red', color.red, ctorContext);
            mustBeNumber('color.green', color.green, ctorContext);
            mustBeNumber('color.blue', color.blue, ctorContext);
            mustBeNumber('duration', duration, ctorContext);
            this.name = name;
            this.color = color;
            this.duration = duration;
        }
        ColorTask.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        ColorTask.prototype.exec = function (slide, host) {
            var thing = host.getDrawable(this.name);
            if (thing) {
                try {
                    var colorFacet = thing.getFacet('color');
                    try {
                        var colorTo = new ColorTo(slide.clock, colorFacet, 'rgb', this.color, this.duration);
                        try {
                            slide.animate(colorFacet, { 'rgb': colorTo });
                        }
                        finally {
                            colorTo.release();
                        }
                    }
                    finally {
                        colorFacet.release();
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
        ColorTask.prototype.undo = function (slide, host) {
        };
        return ColorTask;
    })(Shareable);
    return ColorTask;
});
