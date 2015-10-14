import ISlideCommand = require('../../slideshow/ISlideCommand')
import ISlideHost = require('../../slideshow/ISlideHost')
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
  redo(host: ISlideHost): void {
    console.log("redo => " + this.name)
  }
  undo(host: ISlideHost): void {
    console.log("undo => " + this.name)
  }
}

export = TestCommand