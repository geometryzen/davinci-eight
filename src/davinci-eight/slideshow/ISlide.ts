import IAnimation = require('../slideshow/IAnimation')
import IAnimationClock = require('../slideshow/IAnimationClock')
import IAnimateOptions = require('../slideshow/IAnimateOptions')
import IProperties = require('../slideshow/IProperties')
import ISlideHost = require('../slideshow/ISlideHost')
import ISlideTask = require('../slideshow/ISlideTask')
import IUnknown = require('../core/IUnknown')

/**
 * A slide is a collection of animations.
 * @class ISlide
 */
interface ISlide extends IUnknown {
  /**
   * The clock that provides the timing for slide animations.
   * @property clock
   * @type {IAnimationClock}
   * @readOnly
   */
  clock: IAnimationClock;
  addTask<T extends ISlideTask>(task: T): T;
  animate(object: IProperties, animations: { [name: string]: IAnimation }, options?: IAnimateOptions): void;
  update(speed: number): void;
  exec(host: ISlideHost): void;
  undo(host: ISlideHost): void;
}

export = ISlide