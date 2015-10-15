import ISlide = require('../slideshow/ISlide')
import IDirector = require('../slideshow/IDirector')
import IUnknown = require('../core/IUnknown')

interface ISlideCommand extends IUnknown {
  redo(slide: ISlide, director: IDirector): void;
  undo(slide: ISlide, director: IDirector): void;
}

export = ISlideCommand