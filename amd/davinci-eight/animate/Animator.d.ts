import IAnimation = require('../animate/IAnimation');
import IAnimationClock = require('../animate/IAnimationClock');
import IProperties = require('../animate/IProperties');
import IExchange = require('../animate/IExchange');
import IAnimateOptions = require('../animate/IAnimateOptions');
declare class Animator {
    private drivers;
    private mirrors;
    private _clock;
    constructor();
    protected destructor(): void;
    clock: IAnimationClock;
    /**
     * Attach animator to an object.
     */
    attach(object: IProperties): void;
    /**
     * Hurry all animations on an object by speeding by a factor.
     */
    hurry(object: IProperties, attributes?: IExchange, factor?: number): void;
    /**
     * Stop all animations on an object.
     * @method stop
     * @param object {Animated}
     * @param attributes {IExchange}
     */
    stop(object: IProperties, attributes: IExchange): void;
    /**
     * Animate a set of attributes on an object.
     * @method animate
     * @param object {Animated} The object to be animated
     * @param animation {[name: string]:IAnimation} The animations to be applied by property name.
     * @param options [IAnimateOptions] determine how the attributes will be animated.
     */
    animate(object: IProperties, animations: {
        [name: string]: IAnimation;
    }, options?: IAnimateOptions): void;
    /**
     * Remove current animation on an object attribute.
     */
    dequeue(object: IProperties, key: string, apply?: boolean): void;
    /**
     * Update all currently running animations.
     * Essentially calls `apply` on each IAnimation in the queues of active objects.
     * @method update
     * @param speed {number} Advances the static Animator.now property.
     */
    update(speed: number): void;
}
export = Animator;
