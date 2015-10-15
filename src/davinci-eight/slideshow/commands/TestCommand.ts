import ISlide = require('../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IDirector = require('../../slideshow/IDirector')
import Shareable = require('../../utils/Shareable')

class TestCommand extends Shareable implements ISlideCommand {
  private name: string;
  constructor(name: string) {
    super('TestCommand')
    this.name = name
  }
  protected destructor(): void {
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector): void {
    console.log("redo => " + this.name)
  }
  undo(slide: ISlide, director: IDirector): void {
    console.log("undo => " + this.name)
  }
}

export = TestCommand