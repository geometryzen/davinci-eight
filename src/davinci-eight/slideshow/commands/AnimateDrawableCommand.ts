import IAnimation = require('../slideshow/IAnimation')
import ISlide = require('../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IDirector = require('../../slideshow/IDirector')
import Shareable = require('../../utils/Shareable')

class AnimateDrawableCommand extends Shareable implements ISlideCommand
{
  private drawableName: string;
  private facetName: string;
  private propName: string;
  private animation: IAnimation;
  constructor(drawableName: string, facetName: string, propName: string, animation: IAnimation)
  {
    super('AnimateDrawableCommand')
    this.drawableName = drawableName
    this.facetName = facetName
    this.propName = propName
    this.animation = animation
    this.animation.addRef()
  }
  protected destructor(): void
  {
    this.animation.release()
    this.animation = void 0;
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector): void
  {
    var drawable = director.getDrawable(this.drawableName)
    var target = drawable.getFacet(this.facetName)
    slide.pushAnimation(target, this.propName, this.animation)
  }
  undo(slide: ISlide, director: IDirector): void
  {
    var drawable = director.getDrawable(this.drawableName)
    var target = drawable.getFacet(this.facetName)
    var animation = slide.popAnimation(target, this.propName)
    animation.release()
  }
}

export = AnimateDrawableCommand