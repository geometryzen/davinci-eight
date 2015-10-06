var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../slideshow/Animator', '../utils/IUnknownArray', '../utils/Shareable'], function (require, exports, Animator, IUnknownArray, Shareable) {
    var Slide = (function (_super) {
        __extends(Slide, _super);
        function Slide() {
            // The first thing we do is to call the constructor of the base class.
            _super.call(this, 'Slide');
            this.animator = new Animator();
            this.tasks = new IUnknownArray([], 'Slide.tasks');
        }
        Slide.prototype.destructor = function () {
            this.animator.release();
            this.animator = void 0;
            this.tasks.release();
            this.tasks = void 
            // The last thing we do is to call the destructor of the base class.
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Slide.prototype, "clock", {
            get: function () {
                return this.animator.clock;
            },
            enumerable: true,
            configurable: true
        });
        Slide.prototype.addTask = function (task) {
            this.tasks.push(task);
            return task;
        };
        Slide.prototype.animate = function (object, animations, options) {
            this.animator.animate(object, animations, options);
        };
        Slide.prototype.update = function (speed) {
            this.animator.update(speed);
        };
        Slide.prototype.exec = function (host) {
            var slide = this;
            // FIXME: Loop or functional constructor.
            this.tasks.forEach(function (task) {
                task.exec(slide, host);
            });
        };
        Slide.prototype.undo = function (host) {
            var slide = this;
            this.tasks.forEach(function (task) {
                task.undo(slide, host);
            });
        };
        return Slide;
    })(Shareable);
    return Slide;
});
