import SimplexGeometry = require('../geometries/SimplexGeometry')
import IAnimation = require('../slideshow/IAnimation')
import IDirector = require('../slideshow/IDirector')
import ISlide = require('../slideshow/ISlide')

import ISlideCommand = require('../slideshow/ISlideCommand')
import IUnknownArray = require('../collections/IUnknownArray')
import Shareable = require('../utils/Shareable')

import ColorRGB = require('../core/ColorRGB')
import ColorAnimation = require('../slideshow/animations/ColorAnimation')

import VectorE3 = require('../math/VectorE3')
import Vector3Animation = require('../slideshow/animations/Vector3Animation')

import SpinorE3 = require('../math/SpinorE3')
import Spinor3Animation = require('../slideshow/animations/Spinor3Animation')

import AnimateDrawableCommand = require('../slideshow/commands/AnimateDrawableCommand')
import CreateCuboidDrawable = require('../slideshow/commands/CreateCuboidDrawable')
import CreateDrawable = require('../slideshow/commands/CreateDrawable')
import DestroyDrawableCommand = require('../slideshow/commands/DestroyDrawableCommand')
import UseDrawableInSceneCommand = require('../slideshow/commands/UseDrawableInSceneCommand')

class SlideCommands extends Shareable implements ISlideCommand {
  private commands: IUnknownArray<ISlideCommand>;
  constructor()
  {
    super('SlideCommands')
    this.commands = new IUnknownArray<ISlideCommand>()
  }
  protected destructor(): void
  {
    this.commands.release()
    this.commands = void 0
    super.destructor()
  }
  animateDrawable(drawableName: string, facetName: string, propName: string, animation: IAnimation): number
  {
    return this.commands.pushWeakRef(new AnimateDrawableCommand(drawableName, facetName, propName, animation))
  }
  attitude(drawableName: string, attitude: SpinorE3, duration?: number, callback?:() => any): number
  {
    return this.animateDrawable(drawableName, 'model', 'R', new Spinor3Animation(attitude, duration, callback))
  }
  color(drawableName: string, color: ColorRGB, duration?: number, callback?:() => any): number
  {
    return this.animateDrawable(drawableName, 'color', 'rgb', new ColorAnimation(color, duration, callback))
  }
  createDrawable(drawableName: string, geometry: SimplexGeometry): number
  {
    return this.commands.pushWeakRef(new CreateDrawable(drawableName, geometry))
  }
  cuboid(drawableName: string, a?: VectorE3, b?: VectorE3, c?: VectorE3, k?: number, subdivide?: number, boundary?:  number): number
  {
    return this.commands.pushWeakRef(new CreateCuboidDrawable(drawableName, a, b, c, k, subdivide, boundary))
  }
  destroyDrawable(drawableName: string): number {
    return this.commands.pushWeakRef(new DestroyDrawableCommand(drawableName))
  }
  position(drawableName: string, position: VectorE3, duration?: number, callback?:() => any): number
  {
    return this.animateDrawable(drawableName, 'model', 'X', new Vector3Animation(position, duration, callback))
  }
  useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): number
  {
    return this.commands.pushWeakRef(new UseDrawableInSceneCommand(drawableName, sceneName, confirm))
  }
  pushWeakRef(command: ISlideCommand): number {
    return this.commands.pushWeakRef(command)
  }
  redo(slide: ISlide, director: IDirector): void
  {
    for (var i = 0, iLength = this.commands.length; i < iLength; i++)
    {
      this.commands.getWeakRef(i).redo(slide, director)
    }

  }
  undo(slide: ISlide, director: IDirector): void
  {
    for (var i = this.commands.length -1; i >= 0; i--)
    {
      this.commands.getWeakRef(i).undo(slide, director)
    }
  }
}

export = SlideCommands