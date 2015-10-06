import Cartesian3 = require('../../math/Cartesian3')
import MoveTo = require('../../slideshow/animations/MoveTo')
import ModelFacet = require('../../models/ModelFacet')
import IDrawable = require('../../core/IDrawable')
import SmartMaterialBuilder = require('../../materials/SmartMaterialBuilder')
import IAnimateOptions = require('../../slideshow/IAnimateOptions')
import ISlide = require('../../slideshow/ISlide')
import ISlideHost = require('../../slideshow/ISlideHost')
import ISlideTask = require('../../slideshow/ISlideTask')
import Shareable = require('../../utils/Shareable')
import Symbolic = require('../../core/Symbolic')
import Vector3 = require('../../math/Vector3')

class MoveTask extends Shareable implements ISlideTask {
  private name: string;
  public position: Cartesian3;
  public duration: number;
  public callback: () => void;
  public ease: string;
  public options: IAnimateOptions = {};
  constructor(name: string, position: Cartesian3, duration: number = 300) {
    super('MoveTask')
    this.name = name
    this.position = position
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
          var moveTo = new MoveTo(slide.clock, model, 'position', this.position, this.duration, this.callback, this.ease)
          try {
            slide.animate(model, {'position': moveTo}, this.options)
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

export = MoveTask
