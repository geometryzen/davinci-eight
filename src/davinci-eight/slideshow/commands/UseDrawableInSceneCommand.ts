import ISlide = require('../../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IDirector = require('../../slideshow/IDirector')
import Shareable = require('../../utils/Shareable')

class UseDrawableInSceneCommand extends Shareable implements ISlideCommand
{
  private drawableName: string;
  private sceneName: string;
  private confirm: boolean;
  /**
   * Enables us to restore the drawable in the event of undo.
   */
  private wasHere: boolean;
  constructor(drawableName: string, sceneName: string, confirm: boolean)
  {
    super('TestCommand')
    this.drawableName = drawableName
    this.sceneName = sceneName
    this.confirm = confirm
  }
  protected destructor(): void
  {
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector): void
  {
    this.wasHere = director.isDrawableInScene(this.drawableName, this.sceneName)
    director.useDrawableInScene(this.drawableName, this.sceneName, this.confirm)
  }
  undo(slide: ISlide, director: IDirector): void
  {
    director.useDrawableInScene(this.drawableName, this.sceneName, this.wasHere)
  }
}

export = UseDrawableInSceneCommand