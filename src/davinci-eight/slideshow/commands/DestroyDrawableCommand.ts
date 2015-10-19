import ColorFacet = require('../../uniforms/ColorFacet')
import CuboidSimplexGeometry = require('../../geometries/CuboidSimplexGeometry')
import IDrawable = require('../../core/IDrawable')
import ISlide = require('../slideshow/ISlide')
import ISlideCommand = require('../../slideshow/ISlideCommand')
import IDirector = require('../../slideshow/IDirector')
import MeshMaterial = require('../../materials/MeshMaterial')
import ModelFacet = require('../../models/ModelFacet')
import Shareable = require('../../utils/Shareable')

class DestroyDrawableCommand extends Shareable implements ISlideCommand
{
  private name: string;
  private drawable: IDrawable;
  constructor(name: string)
  {
    super('DestroyDrawableCommand')
    this.name = name
  }
  protected destructor(): void
  {
    if (this.drawable) {
      this.drawable.release()
      this.drawable = void 0
    }
    super.destructor();
  }
  redo(slide: ISlide, director: IDirector)
  {
    this.drawable = director.removeDrawable(this.name)
  }
  undo(slide: ISlide, director: IDirector)
  {
    director.addDrawable(this.drawable, this.name)
    this.drawable.release()
    this.drawable = void 0
  }
}

export = DestroyDrawableCommand
