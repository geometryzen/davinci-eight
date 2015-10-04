var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../animate/animations/Delay', '../utils/Shareable', '../utils/StringIUnknownMap', '../utils/IUnknownArray'], function (require, exports, Delay, Shareable, StringIUnknownMap, IUnknownArray) {
    var Clock = (function () {
        function Clock() {
            this.now = 1;
        }
        Clock.prototype.update = function (speed) {
            this.now += speed;
        };
        return Clock;
    })();
    var Animator = (function () {
        function Animator() {
            this._clock = new Clock();
            this.drivers = new IUnknownArray();
            this.mirrors = new StringIUnknownMap();
        }
        Animator.prototype.destructor = function () {
            this.drivers.release();
            this.drivers = void 0;
            this.mirrors.release();
            this.mirrors = void 0;
        };
        Object.defineProperty(Animator.prototype, "clock", {
            get: function () {
                return this._clock;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Attach animator to an object.
         */
        Animator.prototype.attach = function (object) {
            if (!this.mirrors.exists(object.uuid)) {
                var mirror = new AnimatedMirror();
                this.mirrors.put(object.uuid, mirror);
                mirror.release();
            }
            else {
            }
            // FIXME: This seems crude.
            // Override set method to abort running animations.
            /*
            var set = object.set;
            object.set = function (data: IExchange, ignore: boolean) {
        
              if (!ignore) {
                // Argument parsing
                if (object === undefined || object === null) {
                  return;
                }
                else {
                  // Stop all animations on the given keys
                  animator.stop(this, data);
                }
              }
        
              // Pass through to Animated
              set.call(this, data);
            }
            */
            // Prepare animation queue.
        };
        /**
         * Hurry all animations on an object by speeding by a factor.
         */
        Animator.prototype.hurry = function (object, attributes, factor) {
            if (factor === void 0) { factor = 4; }
            // Reduce
            var mirror = this.mirrors.get(object.uuid);
            if (mirror) {
                var queues = mirror.queues;
                var keys = attributes ? Object.keys(attributes) : queues.keys;
                keys.forEach(function (key) {
                    var queue = queues.get(key);
                    queue.forEach(function (animation) {
                        animation.hurry(factor);
                    });
                    queue.release();
                });
                queues.release();
                mirror.release();
            }
        };
        /**
         * Stop all animations on an object.
         * @method stop
         * @param object {Animated}
         * @param attributes {IExchange}
         */
        Animator.prototype.stop = function (object, attributes) {
            var animator = this;
            var mirror = this.mirrors.get(object.uuid);
            if (mirror) {
                var queues = mirror.queues;
                var keys = attributes ? Object.keys(attributes) : queues.keys;
                keys.forEach(function (key) {
                    var queue = queues.get(key);
                    while (queue) {
                        animator.dequeue(object, key, true);
                        queue.release();
                        queue = queues.get(key);
                    }
                });
            }
            queues.release();
            mirror.release();
        };
        /**
         * Animate a set of attributes on an object.
         * @method animate
         * @param object {Animated} The object to be animated
         * @param animation {[name: string]:IAnimation} The animations to be applied by property name.
         * @param options [IAnimateOptions] determine how the attributes will be animated.
         */
        Animator.prototype.animate = function (object, animations, options) {
            if (options === void 0) { options = {}; }
            var animator = this;
            var clock = this.clock;
            // Ensure that the object has been initialized by having a queue and animations count.
            this.attach(object);
            var mirror = this.mirrors.get(object.uuid);
            try {
                var queues = mirror.queues;
                try {
                    Object.keys(animations).forEach(function (key) {
                        // If necessary, init queue for the current key.
                        if (!queues.exists(key)) {
                            var emptyArray = new IUnknownArray();
                            queues.put(key, emptyArray);
                            emptyArray.release();
                        }
                        var queue = queues.get(key);
                        try {
                            // Queue delay
                            if (options.delay) {
                                var delay = new Delay(clock, object, key, options.delay);
                                queue.push(delay);
                                delay.release();
                                if (mirror.animations++ === 0) {
                                    animator.drivers.push(object);
                                }
                            }
                            // Queue new animation
                            queue.push(animations[key]);
                            // Queue hold
                            if (options.hold) {
                                var hold = new Delay(clock, object, key, options.hold);
                                queue.push(hold);
                                hold.release();
                                if (mirror.animations++ === 0) {
                                    animator.drivers.push(object);
                                }
                            }
                            // Keep track of animating objects
                            if (mirror.animations++ === 0) {
                                animator.drivers.push(object);
                            }
                        }
                        finally {
                            queue.release();
                        }
                    });
                }
                finally {
                    queues.release();
                }
            }
            finally {
                mirror.release();
            }
        };
        /**
         * Remove current animation on an object attribute.
         */
        Animator.prototype.dequeue = function (object, key, apply) {
            if (apply === void 0) { apply = false; }
            var mirror = this.mirrors.get(object.uuid);
            try {
                var queues = mirror.queues;
                try {
                    // Check if key is animated
                    var queue = queues.get(key);
                    if (!queue)
                        return;
                    // Remove from front of queue.
                    var animation = queue.shift();
                    if (queue.length == 0) {
                        queues.remove(key);
                    }
                    // Apply animation instantly
                    if (apply) {
                        animation.skip();
                    }
                    // Keep track of animating objects
                    if (--mirror.animations === 0) {
                        this.drivers.splice(this.drivers.indexOf(object), 1).release();
                    }
                    animation.release();
                }
                finally {
                    queues.release();
                }
            }
            finally {
                mirror.release();
            }
        };
        /**
         * Update all currently running animations.
         * Essentially calls `apply` on each IAnimation in the queues of active objects.
         * @method update
         * @param speed {number} Advances the static Animator.now property.
         */
        Animator.prototype.update = function (speed) {
            var animator = this;
            this._clock.update(speed);
            // Make a shallow copy of the currently active Animated objects.
            var active = this.drivers.slice();
            try {
                active.forEach(function (object) {
                    // Used to make queued animations match up at sub-frame times.
                    var offset = 0;
                    function advance(animations, key) {
                        // Write out animated attribute.
                        var animation = animations.get(0);
                        try {
                            animation.apply(offset || 0);
                            // Remove completed animations.
                            if (animation.done()) {
                                offset = animation.extra();
                                animator.dequeue(object, key);
                                // Recurse into next animation.
                                if (animations.length > 0) {
                                    advance.call(animator, animations, key);
                                }
                            }
                        }
                        finally {
                            animation.release();
                        }
                    }
                    var mirror = animator.mirrors.get(object.uuid);
                    try {
                        var queues = mirror.queues;
                        try {
                            queues.forEach(function (key, animations) {
                                advance(animations, key);
                            });
                        }
                        finally {
                            queues.release();
                        }
                    }
                    finally {
                        mirror.release();
                    }
                });
            }
            finally {
                active.release();
            }
        };
        return Animator;
    })();
    // FIXME: Encapsulation make safer and less ref count issues.
    var AnimatedMirror = (function (_super) {
        __extends(AnimatedMirror, _super);
        /**
         * The super-symmetric partner of an IProperties adapter.
         * This class keeps track of animation state.
         * @class AnimatedMirror
         * @constructor
         */
        function AnimatedMirror() {
            _super.call(this, 'AnimatedMirror');
            this._queues = new StringIUnknownMap();
            this.animations = 0;
        }
        AnimatedMirror.prototype.destructor = function () {
            this._queues.release();
            this._queues = void 0;
        };
        Object.defineProperty(AnimatedMirror.prototype, "queues", {
            get: function () {
                this._queues.addRef();
                return this._queues;
            },
            enumerable: true,
            configurable: true
        });
        return AnimatedMirror;
    })(Shareable);
    return Animator;
});
