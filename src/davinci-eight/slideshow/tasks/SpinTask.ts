import Spinor3Coords = require('../../math/Spinor3Coords')
import SpinTo = require('../../slideshow/animations/SpinTo')
import ModelFacet = require('../../models/ModelFacet')
import IDrawable = require('../../core/IDrawable')
import SmartMaterialBuilder = require('../../materials/SmartMaterialBuilder')
import IAnimateOptions = require('../../slideshow/IAnimateOptions')
import ISlide = require('../../slideshow/ISlide')
import ISlideHost = require('../../slideshow/ISlideHost')
import ISlideTask = require('../../slideshow/ISlideTask')
import Shareable = require('../../utils/Shareable')
import Symbolic = require('../../core/Symbolic')
import Spinor3 = require('../../math/Spinor3')

class SpinTask extends Shareable implements ISlideTask {
  private name: string;
  public attitude: Spinor3Coords;
  public duration: number;
  public callback: () => void;
  public ease: string;
  public options: IAnimateOptions = {};
  constructor(name: string, attitude: Spinor3Coords, duration: number = 300) {
    super('SpinTask')
    this.name = name
    this.attitude = attitude
    this.duration = duration
    this.ease = 'linear'
  }
  destructor(): void {
    super.destructor()
  }
  exec(slide: ISlide, host: ISlideHost): void {
    var thing: IDrawable = host.getDrawable(this.name)
    if (thing) {
      try {
        var model = <ModelFacet>thing.getFacet('model')
        try {
          var moveTo = new SpinTo(slide.clock, model, 'attitude', this.attitude, this.duration, this.callback, this.ease)
          try {
            slide.animate(model, {'attitude': moveTo}, this.options)
          }
          finally {
            moveTo.release()
          }
        }
        finally {
          model.release()
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

export = SpinTask
