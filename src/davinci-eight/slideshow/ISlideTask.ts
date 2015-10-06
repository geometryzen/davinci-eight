import ISlide = require('../slideshow/ISlide')
import ISlideHost = require('../slideshow/ISlideHost')
import IUnknown = require('../core/IUnknown')

interface ISlideTask extends IUnknown {
  // FIXME: 2nd Arg like Director
  exec(slide: ISlide, host: ISlideHost): void
  undo(slide: ISlide, host: ISlideHost): void
}

export = ISlideTask
