import Animator = require('../slideshow/Animator')
import IAnimation = require('../slideshow/IAnimation')
import IAnimationClock = require('../slideshow/IAnimationClock')
import IAnimateOptions = require('../slideshow/IAnimateOptions')
import IProperties = require('../slideshow/IProperties')
import ISlide = require('../slideshow/ISlide')
import ISlideHost = require('../slideshow/ISlideHost')
import ISlideTask = require('../slideshow/ISlideTask')
import IUnknownArray = require('../utils/IUnknownArray')
import Shareable = require('../utils/Shareable')

class Slide extends Shareable implements ISlide {
  private tasks: IUnknownArray<ISlideTask>;
  private animator: Animator;
  constructor() {
    // The first thing we do is to call the constructor of the base class.
    super('Slide')
    this.animator = new Animator()
    this.tasks = new IUnknownArray<ISlideTask>([], 'Slide.tasks')
  }
  protected destructor(): void {
    this.animator.release()
    this.animator = void 0
    this.tasks.release()
    this.tasks = void
    // The last thing we do is to call the destructor of the base class.
    super.destructor()
  }
  get clock(): IAnimationClock {
    return this.animator.clock
  }
  addTask(task: ISlideTask): ISlideTask {
    this.tasks.push(task)
    return task
  }
  animate(object: IProperties, animations: { [name: string]: IAnimation }, options?: IAnimateOptions): void {
    this.animator.animate(object, animations, options)
  }
  update(speed: number): void {
    this.animator.update(speed)
  }
  exec(host: ISlideHost): void {
    var slide = this
    // FIXME: Loop or functional constructor.
    this.tasks.forEach(function(task) {
      task.exec(slide, host)
    })
  }
  undo(host: ISlideHost): void {
    var slide = this
    this.tasks.forEach(function(task) {
      task.undo(slide, host)
    })
  }
}

export = Slide