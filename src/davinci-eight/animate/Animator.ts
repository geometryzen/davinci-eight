import Delay = require('../animate/animations/Delay')
import IAnimation = require('../animate/IAnimation')
import IAnimationClock = require('../animate/IAnimationClock')
import IProperties = require('../animate/IProperties')
import IExchange = require('../animate/IExchange')
import IAnimateOptions = require('../animate/IAnimateOptions')
import Shareable = require('../utils/Shareable')
import StringIUnknownMap = require('../utils/StringIUnknownMap')
import IUnknown = require('../core/IUnknown')
import IUnknownArray = require('../utils/IUnknownArray')

class Clock implements IAnimationClock {
  public now: number = 1;
  constructor() {

  }
  update(speed: number): void {
    this.now += speed;
  }
}

class Animator {
  private drivers: IUnknownArray<IProperties>;
  private mirrors: StringIUnknownMap<AnimatedMirror>;
  private _clock = new Clock();
  constructor() {
    this.drivers = new IUnknownArray<IProperties>()
    this.mirrors = new StringIUnknownMap<AnimatedMirror>()
  }
  protected destructor(): void {
    this.drivers.release()
    this.drivers = void 0
    this.mirrors.release()
    this.mirrors = void 0
  }
  get clock(): IAnimationClock {
    return this._clock
  }
  /**
   * Attach animator to an object.
   */
  attach(object: IProperties) {

    if (!this.mirrors.exists(object.uuid)) {
      var mirror = new AnimatedMirror();
      this.mirrors.put(object.uuid, mirror);
      mirror.release();
    }
    else {
      // Do nothing, object is already known.
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
  }

  /**
   * Hurry all animations on an object by speeding by a factor.
   */
  hurry(object: IProperties, attributes?: IExchange, factor: number = 4) {
    // Reduce
    var mirror = this.mirrors.get(object.uuid)
    if (mirror) {
      var queues = mirror.queues
      var keys = attributes ? Object.keys(attributes) : queues.keys
      keys.forEach(function(key) {
        var queue = queues.get(key)
        queue.forEach(function(animation) {
          animation.hurry(factor)
        })
        queue.release()
      })
      queues.release()
      mirror.release()
    }
  }

  /**
   * Stop all animations on an object.
   * @method stop
   * @param object {Animated}
   * @param attributes {IExchange}
   */
  stop(object: IProperties, attributes: IExchange) {
    var animator = this

    var mirror = this.mirrors.get(object.uuid)
    if (mirror) {
      var queues = mirror.queues
      var keys = attributes ? Object.keys(attributes) : queues.keys
      keys.forEach(function(key) {
        var queue = queues.get(key)
        while(queue) {
          animator.dequeue(object, key, true)
          queue.release()
          queue = queues.get(key)
        }
      })
    }
    queues.release()
    mirror.release()
  }

  /**
   * Animate a set of attributes on an object.
   * @method animate
   * @param object {Animated} The object to be animated
   * @param animation {[name: string]:IAnimation} The animations to be applied by property name.
   * @param options [IAnimateOptions] determine how the attributes will be animated.
   */
  animate(object: IProperties, animations: { [name: string]: IAnimation }, options: IAnimateOptions = {}) {
    var animator = this
    var clock = this.clock

    // Ensure that the object has been initialized by having a queue and animations count.
    this.attach(object)

    var mirror = this.mirrors.get(object.uuid)
    try {
      var queues = mirror.queues
      try {
        Object.keys(animations).forEach(function(key: string) {

          // If necessary, init queue for the current key.
          if (!queues.exists(key)) {
            let emptyArray = new IUnknownArray<IAnimation>()
            queues.put(key, emptyArray)
            emptyArray.release()
          }

          var queue = queues.get(key)
          try {
            // Queue delay
            if (options.delay) {
              let delay = new Delay(clock, object, key, options.delay)
              queue.push(delay)
              delay.release()

              if (mirror.animations++ === 0) {
                animator.drivers.push(object);
              }
            }
            // Queue new animation
            queue.push(animations[key])

            // Queue hold
            if (options.hold) {
              let hold = new Delay(clock, object, key, options.hold);
              queue.push(hold)
              hold.release()

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
            queue.release()
          }
        })
      }
      finally {
        queues.release()
      }
    }
    finally {
      mirror.release()
    }
  }

  /**
   * Remove current animation on an object attribute.
   */
  dequeue(object: IProperties, key: string, apply: boolean = false) {

    var mirror = this.mirrors.get(object.uuid)
    try {
      var queues = mirror.queues
      try {
          // Check if key is animated
          var queue = queues.get(key)
          if (!queue) return;

          // Remove from front of queue.
          var animation = queue.shift();
          if (queue.length == 0) {
            queues.remove(key)
          }

          // Apply animation instantly
          if (apply) {
              animation.skip();
          }

          // Keep track of animating objects
          if (--mirror.animations === 0) {
              this.drivers.splice(this.drivers.indexOf(object), 1).release()
          }
          animation.release()
      }
      finally {
        queues.release()
      }
    }
    finally {
      mirror.release()
    }
  }

  /**
   * Update all currently running animations.
   * Essentially calls `apply` on each IAnimation in the queues of active objects.
   * @method update
   * @param speed {number} Advances the static Animator.now property.
   */
  update(speed: number): void {
    var animator = this

    this._clock.update(speed)

    // Make a shallow copy of the currently active Animated objects.
    var active: IUnknownArray<IProperties> = this.drivers.slice()
    try {
      active.forEach(function(object: IProperties) {

        // Used to make queued animations match up at sub-frame times.
        var offset = 0

        function advance(animations: IUnknownArray<IAnimation>, key: string) {
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
            animation.release()
          }
        }

        var mirror = animator.mirrors.get(object.uuid)
        try {
          var queues = mirror.queues
          try {
            queues.forEach(function(key, animations) {
              advance(animations, key)
            })
          }
          finally {
            queues.release()
          }
        }
        finally {
          mirror.release()
        }
      })
    }
    finally {
      active.release()
    }
  }
}

export = Animator

// FIXME: Encapsulation make safer and less ref count issues.
class AnimatedMirror extends Shareable {
  private _queues: StringIUnknownMap<IUnknownArray<IAnimation>>;
  public animations: number;
  /**
   * The super-symmetric partner of an IProperties adapter.
   * This class keeps track of animation state.
   * @class AnimatedMirror
   * @constructor
   */
  constructor() {
    super('AnimatedMirror')
    this._queues = new StringIUnknownMap<IUnknownArray<IAnimation>>()
    this.animations = 0
  }
  protected destructor(): void {
    this._queues.release()
    this._queues = void 0
  }
  get queues() {
    this._queues.addRef()
    return this._queues
  }
}
