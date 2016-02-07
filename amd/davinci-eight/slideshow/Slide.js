var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../collections/IUnknownArray', '../core/Shareable', '../slideshow/SlideCommands', '../collections/StringIUnknownMap'], function (require, exports, IUnknownArray_1, Shareable_1, SlideCommands_1, StringIUnknownMap_1) {
    var Slide = (function (_super) {
        __extends(Slide, _super);
        function Slide() {
            _super.call(this, 'Slide');
            this.now = 0;
            this.prolog = new SlideCommands_1.default();
            this.epilog = new SlideCommands_1.default();
            this.targets = [];
            this.mirrors = new StringIUnknownMap_1.default();
        }
        Slide.prototype.destructor = function () {
            this.prolog.release();
            this.prolog = void 0;
            this.epilog.release();
            this.epilog = void 0;
            this.targets = void 0;
            this.mirrors.release();
            this.mirrors = void 0;
            _super.prototype.destructor.call(this);
        };
        Slide.prototype.ensureTarget = function (target) {
            if (this.targets.indexOf(target) < 0) {
                this.targets.push(target);
            }
        };
        Slide.prototype.ensureMirror = function (target) {
            if (!this.mirrors.exists(target.uuid)) {
                this.mirrors.putWeakRef(target.uuid, new Mirror());
            }
        };
        Slide.prototype.pushAnimation = function (target, propName, animation) {
            this.ensureTarget(target);
            this.ensureMirror(target);
            var mirror = this.mirrors.getWeakRef(target.uuid);
            mirror.ensureAnimationLane(propName);
            var animationLane = mirror.animationLanes.getWeakRef(propName);
            animationLane.push(animation);
        };
        Slide.prototype.popAnimation = function (target, propName) {
            var mirror = this.mirrors.getWeakRef(target.uuid);
            var animationLane = mirror.animationLanes.getWeakRef(propName);
            return animationLane.pop();
        };
        Slide.prototype.advance = function (interval) {
            this.now += interval;
            for (var i = 0, iLength = this.targets.length; i < iLength; i++) {
                var target = this.targets[i];
                var offset = 0;
                var mirror = this.mirrors.getWeakRef(target.uuid);
                var names = mirror.animationLanes.keys;
                for (var j = 0; j < names.length; j++) {
                    var propName = names[j];
                    var animationLane = mirror.animationLanes.getWeakRef(propName);
                    offset = animationLane.apply(target, propName, this.now, offset);
                }
            }
        };
        Slide.prototype.doProlog = function (director, forward) {
            if (forward) {
                this.prolog.redo(this, director);
            }
            else {
                this.prolog.undo(this, director);
            }
        };
        Slide.prototype.doEpilog = function (director, forward) {
            if (forward) {
                this.epilog.redo(this, director);
            }
            else {
                this.epilog.undo(this, director);
            }
        };
        Slide.prototype.undo = function (director) {
            for (var i = 0, iLength = this.targets.length; i < iLength; i++) {
                var target = this.targets[i];
                var mirror = this.mirrors.getWeakRef(target.uuid);
                var names = mirror.animationLanes.keys;
                for (var j = 0; j < names.length; j++) {
                    var propName = names[j];
                    var animationLane = mirror.animationLanes.getWeakRef(propName);
                    animationLane.undo(target, propName);
                }
            }
        };
        return Slide;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Slide;
    var AnimationLane = (function (_super) {
        __extends(AnimationLane, _super);
        function AnimationLane() {
            _super.call(this, 'AnimationLane');
            this.completed = new IUnknownArray_1.default();
            this.remaining = new IUnknownArray_1.default();
        }
        AnimationLane.prototype.destructor = function () {
            this.completed.release();
            this.completed = void 0;
            this.remaining.release();
            this.remaining = void 0;
            _super.prototype.destructor.call(this);
        };
        AnimationLane.prototype.pop = function () {
            if (this.remaining.length > 0) {
                return this.remaining.pop();
            }
            else {
                return this.completed.pop();
            }
        };
        AnimationLane.prototype.push = function (animation) {
            return this.remaining.push(animation);
        };
        AnimationLane.prototype.pushWeakRef = function (animation) {
            return this.remaining.pushWeakRef(animation);
        };
        AnimationLane.prototype.apply = function (target, propName, now, offset) {
            var done = false;
            while (!done) {
                if (this.remaining.length > 0) {
                    var animation = this.remaining.getWeakRef(0);
                    animation.apply(target, propName, now, offset);
                    if (animation.done(target, propName)) {
                        offset = animation.extra(now);
                        this.completed.push(this.remaining.shift());
                    }
                    else {
                        done = true;
                    }
                }
                else {
                    done = true;
                }
            }
            return offset;
        };
        AnimationLane.prototype.undo = function (target, propName) {
            while (this.completed.length > 0) {
                this.remaining.unshift(this.completed.pop());
            }
            for (var i = this.remaining.length - 1; i >= 0; i--) {
                var animation = this.remaining.getWeakRef(i);
                animation.undo(target, propName);
            }
        };
        return AnimationLane;
    })(Shareable_1.default);
    var Mirror = (function (_super) {
        __extends(Mirror, _super);
        function Mirror() {
            _super.call(this, 'Mirror');
            this.animationLanes = new StringIUnknownMap_1.default();
        }
        Mirror.prototype.destructor = function () {
            this.animationLanes.release();
            this.animationLanes = void 0;
            _super.prototype.destructor.call(this);
        };
        Mirror.prototype.ensureAnimationLane = function (key) {
            if (!this.animationLanes.exists(key)) {
                this.animationLanes.putWeakRef(key, new AnimationLane());
            }
        };
        return Mirror;
    })(Shareable_1.default);
});
