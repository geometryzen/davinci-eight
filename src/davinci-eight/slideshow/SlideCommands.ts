import Geometry = require('../geometries/Geometry')
import IAnimation = require('../slideshow/IAnimation')
import IDirector = require('../slideshow/IDirector')
import ISlide = require('../slideshow/ISlide')

import ISlideCommand = require('../slideshow/ISlideCommand')
import IUnknownArray = require('../collections/IUnknownArray')
import Shareable = require('../utils/Shareable')

import ColorRGB = require('../core/ColorRGB')
import ColorAnimation = require('../slideshow/animations/ColorAnimation')

import Cartesian3 = require('../math/Cartesian3')
import Vector3Animation = require('../slideshow/animations/Vector3Animation')

import Spinor3Coords = require('../math/Spinor3Coords')
import Spinor3Animation = require('../slideshow/animations/Spinor3Animation')

import AnimateDrawableCommand = require('../slideshow/commands/AnimateDrawableCommand')
import CreateCuboidDrawable = require('../slideshow/commands/CreateCuboidDrawable')
import CreateDrawable = require('../slideshow/commands/CreateDrawable')
import DestroyDrawableCommand = require('../slideshow/commands/DestroyDrawableCommand')
import UseDrawableInSceneCommand = require('../slideshow/commands/UseDrawableInSceneCommand')

class SlideCommands extends Shareable implements ISlideCommand {
  private commands: IUnknownArray<ISlideCommand>;
  constructor(userName: string)
  {
    super('SlideCommands')
    this.commands = new IUnknownArray<ISlideCommand>([], userName)
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
  attitude(drawableName: string, attitude: Spinor3Coords, duration?: number, callback?:() => any): number
  {
    return this.animateDrawable(drawableName, 'model', 'attitude', new Spinor3Animation(attitude, duration, callback))
  }
  color(drawableName: string, color: ColorRGB, duration?: number, callback?:() => any): number
  {
    return this.animateDrawable(drawableName, 'color', 'rgb', new ColorAnimation(color, duration, callback))
  }
  createDrawable(drawableName: string, geometry: Geometry): number
  {
    return this.commands.pushWeakRef(new CreateDrawable(drawableName, geometry))
  }
  cuboid(drawableName: string, a?: Cartesian3, b?: Cartesian3, c?: Cartesian3, k?: number, subdivide?: number, boundary?:  number): number
  {
    return this.commands.pushWeakRef(new CreateCuboidDrawable(drawableName, a, b, c, k, subdivide, boundary))
  }
  destroyDrawable(drawableName: string): number {
    return this.commands.pushWeakRef(new DestroyDrawableCommand(drawableName))
  }
  position(drawableName: string, position: Cartesian3, duration?: number, callback?:() => any): number
  {
    return this.animateDrawable(drawableName, 'model', 'position', new Vector3Animation(position, duration, callback))
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