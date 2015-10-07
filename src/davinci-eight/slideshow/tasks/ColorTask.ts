import Color = require('../../core/Color')
import ColorRGB = require('../../core/ColorRGB')
import ColorTo = require('../../slideshow/animations/ColorTo')
import ColorFacet = require('../../uniforms/ColorFacet')
import ModelFacet = require('../../models/ModelFacet')
import mustBeString = require('../../checks/mustBeString')
import mustBeNumber = require('../../checks/mustBeNumber')
import mustBeObject = require('../../checks/mustBeObject')
import mustBeLike = require('../../checks/mustBeLike')
import IDrawable = require('../../core/IDrawable')
import SmartMaterialBuilder = require('../../materials/SmartMaterialBuilder')
import ISlide = require('../../slideshow/ISlide')
import ISlideHost = require('../../slideshow/ISlideHost')
import ISlideTask = require('../../slideshow/ISlideTask')
import IUnknownExt = require('../../core/IUnknownExt')
import Shareable = require('../../utils/Shareable')
import Symbolic = require('../../core/Symbolic')

function ctorContext() {
  return 'ColorTask constructor'
}

var COLOR_RGB_DUCK: ColorRGB = {red: 0, green: 0, blue: 0}

class ColorTask extends Shareable implements ISlideTask, IUnknownExt<ColorTask> {
  private name: string;
  public color: ColorRGB;
  public duration: number;
  public callback: () => void;
  public ease: string;
  constructor(name: string, color: ColorRGB, duration: number = 300) {
    super('ColorTask')
    mustBeString('name', name, ctorContext)
    mustBeObject('color', color, ctorContext)
    mustBeNumber('color.red', color.red, ctorContext)
    mustBeNumber('color.green', color.green, ctorContext)
    mustBeNumber('color.blue', color.blue, ctorContext)
    mustBeNumber('duration', duration, ctorContext)
    this.name = name
    this.color = color
    this.duration = duration
  }
  destructor(): void {
    super.destructor()
  }
  incRef(): ColorTask {
    this.addRef()
    return this
  }
  decRef(): ColorTask {
    this.release()
    return this
  }
  exec(slide: ISlide, host: ISlideHost): void {
    var thing: IDrawable = host.getDrawable(this.name)
    if (thing) {
      try {
        var colorFacet = <ColorFacet>thing.getFacet('color')
        try {
          var colorTo = new ColorTo(slide.clock, colorFacet, 'rgb', this.color, this.duration)
          try {
            slide.animate(colorFacet, {'rgb': colorTo})
          }
          finally {
            colorTo.release()
          }
        }
        finally {
          colorFacet.release()
        }
      }
      finally {
        thing.release()
      }
    }
    else {
      console.warn(this.name + ' drawable not found')
    }
  }
  undo(slide: ISlide, host: ISlideHost): void {
  }
}

export = ColorTask
