import IAnimation from '../slideshow/IAnimation';
import AnimationOptions from './AnimationOptions';
import IAnimationTarget from '../slideshow/IAnimationTarget';
import {Color} from '../core/Color';
import ColorAnimation from './animations/ColorAnimation';
import exchange from '../base/exchange';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import NarrateAnimation from './animations/NarrateAnimation';
import ShareableArray from '../collections/ShareableArray';
import {ShareableBase} from '../core/ShareableBase';
import SlideCommands from '../slideshow/SlideCommands';
import SlideHost from './SlideHost';
import SpinorE3 from '../math/SpinorE3';
import Spinor3Animation from './animations/Spinor3Animation';
import StringShareableMap from '../collections/StringShareableMap';
import VectorE3 from '../math/VectorE3';
import Vector3Animation from './animations/Vector3Animation';
import WaitAnimation from './animations/WaitAnimation';

class TargetProperty {
  constructor(private slide: Slide, private objectId: string, private propName: string) {

  }
  setColor(color: Color, duration = 300, options?: AnimationOptions): TargetProperty {
    this.slide.setColor(this.objectId, this.propName, color, duration, options);
    return this;
  }
  setNarrate(text: string, duration?: number, options?: AnimationOptions): TargetProperty {
    this.slide.setNarrate(this.objectId, this.propName, text, duration, options);
    return this;
  }
  setSpinor(R: SpinorE3, duration?: number, options?: AnimationOptions): TargetProperty {
    this.slide.setSpinor(this.objectId, this.propName, R, duration, options);
    return this;
  }
  setVector(X: VectorE3, duration?: number, options?: AnimationOptions): TargetProperty {
    this.slide.setVector(this.objectId, this.propName, X, duration, options);
    return this;
  }
  setWait(duration: number, options?: AnimationOptions): TargetProperty {
    this.slide.setWait(this.objectId, this.propName, duration, options);
    return this;
  }
}

export default class Slide extends ShareableBase {
  public prolog: SlideCommands;
  public epilog: SlideCommands;
  /**
   * The objects that we are going to manipulate.
   */
  private mirrors: Mirror[];
  /**
   * The time standard for this Slide.
   */
  private now = 0;
  constructor(private host: SlideHost) {
    super();
    this.setLoggingName('Slide');
    mustBeObject('host', host);
    this.prolog = new SlideCommands();
    this.epilog = new SlideCommands();
    this.mirrors = [];
  }
  protected destructor(levelUp: number): void {
    this.prolog.release();
    this.prolog = void 0;
    this.epilog.release();
    this.epilog = void 0;
    this.mirrors = void 0;

    super.destructor(levelUp + 1);
  }
  private ensureTargetContext(objectId: string): Mirror {
    for (let i = 0; i < this.mirrors.length; i++) {
      const mirror = this.mirrors[i];
      if (mirror.objectId === objectId) {
        return mirror;
      }
    }
    const mirror = new Mirror(objectId);
    this.mirrors.push(mirror);
    return mirror;
  }

  add(objectId: string, propName: string, animation: IAnimation): Slide {
    mustBeString('objectId', objectId);
    mustBeString('name', propName);

    const mirror = this.ensureTargetContext(objectId);

    mirror.ensureAnimationLane(propName);

    const animationLane = mirror.animationLanes.getWeakRef(propName);

    animationLane.push(animation);

    return this;
  }
  colorize(objectId: string, color: Color, duration = 300, options?: AnimationOptions): Slide {
    return this.setColor(objectId, 'color', color, duration, options);
  }
  position(objectId: string, X: VectorE3, duration?: number, options?: AnimationOptions): Slide {
    return this.setVector(objectId, 'X', X, duration, options);
  }
  attitude(objectId: string, R: SpinorE3, duration?: number, options?: AnimationOptions): Slide {
    return this.setSpinor(objectId, 'R', R, duration, options);
  }
  setColor(objectId: string, propName: string, color: Color, duration = 300, options?: AnimationOptions): Slide {
    return this.add(objectId, propName, new ColorAnimation(color, duration, options));
  }
  setNarrate(objectId: string, propName: string, text: string, duration?: number, options?: AnimationOptions): Slide {
    return this.add(objectId, propName, new NarrateAnimation(text, duration));
  }
  setSpinor(objectId: string, propName: string, R: SpinorE3, duration?: number, options?: AnimationOptions): Slide {
    return this.add(objectId, propName, new Spinor3Animation(R, duration, options));
  }
  setVector(objectId: string, propName: string, X: VectorE3, duration?: number, options?: AnimationOptions): Slide {
    return this.add(objectId, propName, new Vector3Animation(X, duration, options));
  }
  setWait(objectId: string, propName: string, duration: number, options?: AnimationOptions): Slide {
    return this.add(objectId, propName, new WaitAnimation(duration));
  }
  target(objectId: string, name: string): TargetProperty {
    return new TargetProperty(this, objectId, mustBeString('name', name));
  }

  /**
   * Update all currently running animations.
   * Essentially calls `apply` on each IAnimation in the queues of active objects.
   */
  advance(interval: number): void {
    this.now += interval

    for (let i = 0, iLength = this.mirrors.length; i < iLength; i++) {
      const mirror = this.mirrors[i];
      const target = this.host.getTarget(mirror.objectId);
      /**
       * `offset` is variable used to keep things running on schedule.
       * If an animation finishes before the interval, it reports the
       * duration `extra` that brings the time to `now`. Subsequent animations
       * get a head start by considering their start time to be now - offset.
       */
      let offset = 0;
      const names = mirror.animationLanes.keys;
      for (let j = 0; j < names.length; j++) {
        const propName = names[j];
        const animationLane = mirror.animationLanes.getWeakRef(propName);
        offset = animationLane.apply(target, this.now, offset);
      }
      // There may not be a target if it has not been created yet.
      if (target && target.release) {
        target.release();
      }
    }
  }
  doProlog(host: SlideHost, forward: boolean): void {
    if (forward) {
      this.prolog.redo(this, host)
    }
    else {
      this.prolog.undo(this, host)
    }
  }
  doEpilog(host: SlideHost, forward: boolean): void {
    if (forward) {
      this.epilog.redo(this, host);
    }
    else {
      this.epilog.undo(this, host);
    }
  }
  undo(host: SlideHost): void {
    for (let i = 0, iLength = this.mirrors.length; i < iLength; i++) {
      const mirror = this.mirrors[i];
      const names = mirror.animationLanes.keys;
      for (let j = 0; j < names.length; j++) {
        const propName = names[j];
        const animationLane = mirror.animationLanes.getWeakRef(propName);
        animationLane.undo();
      }
    }
  }
}

class AnimationLane extends ShareableBase {
  private target: IAnimationTarget;
  private completed: ShareableArray<IAnimation>;
  private remaining: ShareableArray<IAnimation>;
  constructor(private propName: string) {
    super()
    this.setLoggingName('AnimationLane');
    this.target = void 0;
    this.completed = new ShareableArray<IAnimation>([]);
    this.remaining = new ShareableArray<IAnimation>([]);
  }
  protected destructor(levelUp: number): void {
    this.completed = exchange(this.completed, void 0);
    this.remaining = exchange(this.remaining, void 0);
    this.target = exchange(this.target, void 0);
    super.destructor(levelUp + 1);
  }
  pop(): IAnimation {
    if (this.remaining.length > 0) {
      return this.remaining.pop();
    }
    else {
      return this.completed.pop();
    }
  }
  push(animation: IAnimation): number {
    return this.remaining.push(animation);
  }
  pushWeakRef(animation: IAnimation): number {
    return this.remaining.pushWeakRef(animation);
  }
  apply(target: IAnimationTarget, now: number, offset: number): number {
    this.target = exchange(this.target, target);
    let done = false;
    while (!done) {
      if (this.remaining.length > 0) {
        const animation = this.remaining.getWeakRef(0);
        animation.apply(target, this.propName, now, offset);
        if (animation.done(target, this.propName)) {
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
  }
  undo(): void {
    while (this.completed.length > 0) {
      this.remaining.unshift(this.completed.pop());
    }
    for (let i = this.remaining.length - 1; i >= 0; i--) {
      const animation = this.remaining.getWeakRef(i);
      animation.undo(this.target, this.propName);
    }
    this.target = exchange(this.target, void 0);
  }
}

/**
 * The companion to a target: IAnimationTarget containing animation state.
 */
class Mirror extends ShareableBase {
  /**
   * A map from property name to a list of properties of the property value.
   * It should be possible to animate many properties of a target at once.
   * However, a given property should only be animated in one way at a given time.
   * For these reasons, we structure the data as map from property name to a queue of animations.
   */
  public animationLanes: StringShareableMap<AnimationLane>;
  constructor(public objectId: string) {
    super();
    this.setLoggingName('Mirror');
    mustBeString('objectId', objectId);
    this.animationLanes = new StringShareableMap<AnimationLane>();
  }

  protected destructor(levelUp: number): void {
    mustBeNumber('levelUp', levelUp);
    this.animationLanes = exchange(this.animationLanes, void 0);
    super.destructor(levelUp + 1);
  }
  ensureAnimationLane(name: string): void {
    mustBeString('name', name);
    if (!this.animationLanes.exists(name)) {
      this.animationLanes.putWeakRef(name, new AnimationLane(name));
    }
  }
}
