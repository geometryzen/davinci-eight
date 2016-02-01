import IAnimation from '../slideshow/IAnimation';
import IAnimationTarget from '../slideshow/IAnimationTarget';
import IDirector from '../slideshow/IDirector';
import ISlide from '../slideshow/ISlide';
import ISlideCommand from '../slideshow/ISlideCommand';
import IUnknown from '../core/IUnknown';
import IUnknownArray from '../collections/IUnknownArray';
import mustBeNumber from '../checks/mustBeNumber';
import Shareable from '../utils/Shareable';
import SlideCommands from '../slideshow/SlideCommands';
import StringIUnknownMap from '../collections/StringIUnknownMap';
import WaitAnimation from '../slideshow/animations/WaitAnimation';

/**
 * @class Slide
 */
export default class Slide extends Shareable implements ISlide {
    public prolog: SlideCommands;
    public epilog: SlideCommands;
    /**
     * The objects that we are going to manipulate.
     */
    private targets: IAnimationTarget[];
    /**
     * The companions to each target that maintain animation state.
     */
    private mirrors: StringIUnknownMap<Mirror>;
    /**
     * The time standard for this Slide.
     */
    private now = 0;
    /**
     * @class Slide
     * @constructor
     */
    constructor() {
        super('Slide')
        this.prolog = new SlideCommands()
        this.epilog = new SlideCommands()
        this.targets = []
        this.mirrors = new StringIUnknownMap<Mirror>()
    }
    protected destructor(): void {
        this.prolog.release()
        this.prolog = void 0
        this.epilog.release()
        this.epilog = void 0
        this.targets = void 0
        this.mirrors.release()
        this.mirrors = void 0

        super.destructor()
    }
    private ensureTarget(target: IAnimationTarget) {
        if (this.targets.indexOf(target) < 0) {
            this.targets.push(target)
        }
    }
    private ensureMirror(target: IAnimationTarget) {
        if (!this.mirrors.exists(target.uuid)) {
            this.mirrors.putWeakRef(target.uuid, new Mirror())
        }
    }
    pushAnimation(target: IAnimationTarget, propName: string, animation: IAnimation) {
        this.ensureTarget(target)
        this.ensureMirror(target)

        var mirror = this.mirrors.getWeakRef(target.uuid)

        mirror.ensureAnimationLane(propName)

        var animationLane = mirror.animationLanes.getWeakRef(propName)

        animationLane.push(animation)
    }
    popAnimation(target: IAnimationTarget, propName: string): IAnimation {

        var mirror = this.mirrors.getWeakRef(target.uuid)

        var animationLane = mirror.animationLanes.getWeakRef(propName)

        return animationLane.pop()
    }

    /**
     * Update all currently running animations.
     * Essentially calls `apply` on each IAnimation in the queues of active objects.
     * @method advance
     * @param interval {number} Advances the static Slide.now property.
     */
    advance(interval: number): void {
        this.now += interval

        for (var i = 0, iLength = this.targets.length; i < iLength; i++) {
            var target = this.targets[i]
            /**
             * `offset` is variable used to keep things running on schedule.
             * If an animation finishes before the interval, it reports the
             * duration `extra` that brings the tome to `now`. Subsequent animations
             * get a head start by considering their start time to be now - offset.
             */
            var offset = 0
            var mirror = this.mirrors.getWeakRef(target.uuid)
            var names = mirror.animationLanes.keys;
            for (var j = 0; j < names.length; j++) {
                var propName = names[j]
                var animationLane = mirror.animationLanes.getWeakRef(propName)
                offset = animationLane.apply(target, propName, this.now, offset)
            }
        }
    }
    doProlog(director: IDirector, forward: boolean): void {
        if (forward) {
            this.prolog.redo(this, director)
        }
        else {
            this.prolog.undo(this, director)
        }
    }
    doEpilog(director: IDirector, forward: boolean): void {
        if (forward) {
            this.epilog.redo(this, director)
        }
        else {
            this.epilog.undo(this, director)
        }
    }
    undo(director: IDirector): void {
        for (var i = 0, iLength = this.targets.length; i < iLength; i++) {
            var target = this.targets[i]
            var mirror = this.mirrors.getWeakRef(target.uuid)
            var names = mirror.animationLanes.keys;
            for (var j = 0; j < names.length; j++) {
                var propName = names[j]
                var animationLane = mirror.animationLanes.getWeakRef(propName)
                animationLane.undo(target, propName)
            }
        }
    }
}

class AnimationLane extends Shareable {
    private completed: IUnknownArray<IAnimation>;
    private remaining: IUnknownArray<IAnimation>;
    constructor() {
        super('AnimationLane')
        this.completed = new IUnknownArray<IAnimation>()
        this.remaining = new IUnknownArray<IAnimation>()
    }
    protected destructor(): void {
        this.completed.release()
        this.completed = void 0
        this.remaining.release()
        this.remaining = void 0
        super.destructor()
    }
    pop(): IAnimation {
        if (this.remaining.length > 0) {
            return this.remaining.pop()
        }
        else {
            return this.completed.pop()
        }
    }
    push(animation: IAnimation): number {
        return this.remaining.push(animation)
    }
    pushWeakRef(animation: IAnimation): number {
        return this.remaining.pushWeakRef(animation)
    }
    apply(target: IAnimationTarget, propName: string, now: number, offset: number): number {
        var done = false;
        while (!done) {
            if (this.remaining.length > 0) {
                var animation = this.remaining.getWeakRef(0)
                animation.apply(target, propName, now, offset)
                if (animation.done(target, propName)) {
                    offset = animation.extra(now)
                    this.completed.push(this.remaining.shift())
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
    }
    undo(target: IAnimationTarget, propName: string): void {
        while (this.completed.length > 0) {
            this.remaining.unshift(this.completed.pop())
        }
        for (var i = this.remaining.length - 1; i >= 0; i--) {
            var animation = this.remaining.getWeakRef(i)
            animation.undo(target, propName)
        }
    }
}

/**
 * The companion to a target: IAnimationTarget containing animation state.
 */
class Mirror extends Shareable {
    /**
     * A map from property name to a list of properties of the property value.
     * It should be possible to animate many properties of a target at once.
     * However, a given property should only be animated in one way at a given time.
     * For these reasons, we structure the data as map from property name to a queue of animations.
     */
    public animationLanes: StringIUnknownMap<AnimationLane>;
    constructor() {
        super('Mirror')
        this.animationLanes = new StringIUnknownMap<AnimationLane>()
    }

    protected destructor(): void {
        this.animationLanes.release()
        this.animationLanes = void 0
        super.destructor()
    }
    ensureAnimationLane(key: string): void {
        if (!this.animationLanes.exists(key)) {
            this.animationLanes.putWeakRef(key, new AnimationLane())
        }
    }
}
